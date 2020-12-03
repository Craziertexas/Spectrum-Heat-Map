from rtlsdr import *
from scipy import signal
from math import log10
import json
import numpy as np
import matplotlib.pyplot as plt 
import socket
import requests

class FreqAnalizer():

    def __init__(self):
        #SDR Interface
        self.SDR = RtlSdr()
        self.SDR.set_bandwidth = 3e6
        self.SDR.set_sample_rate = 3e6
        self.SDR.set_gain = 0
        #UDP Server
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.bind(('192.168.20.64', 40000))
        self.mainloop()

    def mainloop(self):
        while True:
            capture_sw = bool(input('Tomar datos?'))
            if capture_sw:
                Freqs, Power = self.get_spectrum(min_freq= 100, max_freq= 1700, numsamples= 256, avgsamples=1)
                Freqs, Power = self.formmater(power=Power, freq=Freqs)
                plt.plot(Freqs, Power)
                plt.show()
                data_sw = bool(input('Espectro correcto?'))
                if data_sw:
                    print('Esperando coordenadas...')
                    coordinates = self.gps()
                    packet = {"power": Power.tolist(),"frequencies":Freqs.tolist() ,"coordinates":{"lng":coordinates[0],"lat":coordinates[1]}}
            http_sw = False
            while not http_sw:
                try:
                    response = requests.post("http://localhost:4000/INSERT",json=packet)
                    print('Paquete:')
                    print(response.json())
                except:
                    print('ERROR')
                http_sw = bool(input('Se envió correctamente?'))


    def formmater(self, power, freq):
        Power_np = np.array(power)
        Freqs_np = (np.array(freq)).astype(int)
        Freq_base = 99
        Power_new = np.zeros(1600)
        Freqs_new = np.zeros(1600)
        lastz = 0
        for i in range (0,1600):
            Freq_base = Freq_base + 1
            print('Looking for {}'.format(Freq_base))
            zwrite = True
            n = 0
            for z in range(0, np.shape(Freqs_np)[0]):
                if zwrite:
                    z = lastz
                    zwrite = False
                if Freqs_np[z] == Freq_base:
                    print('FOUND!')
                    Power_new[i] = Power_np[z] + Power_new[i]
                    n = n + 1
                    lastz = z
            Power_new[i] = Power_new[i]/n
            Freqs_new[i] = Freq_base
            if Freq_base > 1700:
                break
        Power_new = Power_new.astype(int)
        print(Power_new)
        print(Freqs_new)
        return Freqs_new, Power_new
        

    def gps(self):
        sw_coordinates = False
        while not sw_coordinates:
            data, address = self.socket.recvfrom(4096)
            print('recieved {} from {}'.format(len(data), address))
            data = data.decode()
            data = data.split('\n')
            print('Data:')
            print(data)
            sw_coordinates = bool(input('Coordenadas correctas?'))
        if sw_coordinates:
            return data

    #https://onceinawhileprojects.wordpress.com/2018/05/27/sdr-spectrum-analyzer-python/
    #Metodo tomado de https://bitbucket.org/LightEmittingDude/sdr-speca/src/master/
    def get_spectrum(self, min_freq, max_freq, numsamples, avgsamples):
        """function that gets called repeatedly to get the spectrum"""
        xData = []
        yData = []
        trimRatio = 0.75 # this is the ratio of the FFT bins taken to remove FFT edge effects
        # read samples that covers the required frequency span
        #User Output
        print("Frequency Bandwidth min: {}, max: {}".format(min_freq, max_freq))
        print("Initializing...")
        self.SDR.center_freq = min_freq * 1e6 + (self.SDR.set_sample_rate * trimRatio) / 2
        while self.SDR.center_freq < (max_freq * 1e6 + (self.SDR.set_sample_rate * trimRatio) / 2):
            #User Output
            print("Center Frequency: {}".format(self.SDR.center_freq))
            # read samples from SDR
            samples = self.SDR.read_samples(avgsamples*numsamples)
            # calculate power spectral density
            f, pxx = signal.welch(samples, fs=self.SDR.set_sample_rate, nperseg=numsamples)
            # rotate the arrays so the plot values are continuous and also trim the edges
            f = list(f)
            pxx = list(pxx)
            f = f[int(numsamples/2 + numsamples*(1-trimRatio)/2):] + f[:int(numsamples/2 - numsamples*(1-trimRatio)/2)]
            pxx = pxx[int(numsamples/2 + numsamples*(1-trimRatio)/2):] + pxx[:int(numsamples/2 - numsamples*(1-trimRatio)/2)]
            # adjust the format of the values to be plotted and add to plot arrays
            xData = xData + [(x+self.SDR.center_freq)/1e6 for x in f]
            yData = yData + [10*log10(y) for y in pxx]
            # calculate the next center frequency
            self.SDR.center_freq = self.SDR.center_freq + (self.SDR.set_sample_rate * trimRatio)
        return xData, yData

if __name__ == "__main__":
    FreqAnalizer()