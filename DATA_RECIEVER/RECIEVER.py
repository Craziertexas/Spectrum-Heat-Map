from pylab import *
from rtlsdr import *
from time import sleep
import numpy as np

class RECEIVER():
    
    def __init__(self):
        self.manager()
       
        
    def manager(self):
        
        self.sdr= RtlSdr()
        self.sdr.gain=0
        self.sdr.sample_rate=2.4e6

        try:
            min=int(input("Enter the min frequency"))
            max=int(input("Enter the max frequency"))
        except:
            print("Wrong numbers, taking defaul values")
            min=int(102e6)
            max=int(104e6)
            
        sw=True
        number_windows=0

        for center in range(min,max,(int(3e6))):
            if sw:
                print("Center: ",center)
                buff=self.data_collector(center)
                data=buff
                sw=False
            else:
                print("Center: ",center)
                buff=self.data_collector(center)
                data=np.concatenate((data,buff))
            number_windows=number_windows+1

        s=np.fft.fft(data)
        f=np.fft.fftfreq(n=(np.shape(data))[0],d=1/self.sdr.sample_rate)
        plot(f,abs(s))
        xlabel('Frequency')
        ylabel('Relative power (dB)')
        show()

        self.sdr.close()
        
    def data_collector(self,center):
        self.sdr.center_freq=center
        samples=self.sdr.read_samples(1024*1.5)
        return samples
        
if __name__ =="__main__":
    RECEIVER()