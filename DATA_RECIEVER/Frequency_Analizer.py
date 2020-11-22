from rtlsdr import *
import time as TimeModule
import numpy as np
import matplotlib.pyplot as plt 

class FreqAnalizer():

    def __init__(self):
        self.SdrSetup()
        self.FreqRangeInput()
        mag, freq = self.SampleLoop()
        mag, freq = self.Data_processing(mag,freq)
        plt.plot(freq, 20*np.log10(mag))
        plt.show()
        #CellPhone GPS
        #Send to DataBase

    def SdrSetup(self):
        self.sdr = RtlSdr()
        self.sdr.gain = 4
        self.sdr.sample_rate = 2.4e6 #Sample Rate >= 2*Max Readable Freq
    
    def FreqRangeInput(self):
        try:
            self.min_freq = int(input("Set min Frequency"))
            self.max_freq = int(input("Set max Frequency"))
            print("Min: {} Hz",self.min_freq)
            print("Max: {} Hz",self.max_freq)
        except:
            print("Wrong input, taking default settings")
            self.min_freq = 100e6
            self.max_freq = 170e6
            print("Min: {} Hz",self.min_freq)
            print("Max: {} Hz",self.max_freq)
    
    def SampleLoop(self):
        sw = True
        for center in range(int(self.min_freq),int(self.max_freq),int(2e6)):
            if sw:
                print("Center: {} Hz",center)
                buff = self.DataCollector(center)
                mag, freq = self.FFT_Generator(buff)
                sw = False
            else:
                print("Center: {} Hz",center)
                buff = self.DataCollector(center)
                buffmag, bufffreq = self.FFT_Generator(buff)
                mag = np.concatenate((mag, buffmag))
                freq = np.concatenate((freq, bufffreq))
        return mag,freq
    
    def DataCollector(self, center):
        self.sdr.center_freq = center
        samples = self.sdr.read_samples(256*1024)
        return samples

    def FFT_Generator(self,data):
        psd = plt.psd(data, Fs=(self.sdr.sample_rate/1e6), Fc=(self.sdr.center_freq/1e6),NFFT=1024)
        mag = psd[0]
        freq = psd[1]
        return mag, freq
    
    def Data_processing(self, mag, freq):
        medium = int(((mag.size) /2))
        mag[medium - 1] = mag[medium - 2]
        mag[medium] = mag[medium - 1]
        mag[medium + 1] = mag[medium]
        sw = True
        buffmag = np.empty(freq.size)
        bufffreq = np.empty(freq.size)
        for i in range(0,(freq.size -1)):
            if sw:
                z = 0
                buffmag[z] = mag[i]
                bufffreq[z] = freq[i]
                sw = False
            else:
                if freq[i] != freq[i - 1]:
                    z = z +1
                    bufffreq[z] = freq[i]
                    buffmag[z] = mag[i]
        return buffmag, bufffreq

if __name__ == "__main__":
    FreqAnalizer()