from pylab import *
from rtlsdr import *
from time import sleep

class RECEIVER():
    
    def __init__(self):
        
        self.sdr= RtlSdr()
        self.sdr.gain=4
        self.sdr.sample_rate=2.4e6
        min=int(input("Enter the min frequency"))
        max=int(input("Enter the max frequency"))
        
        for center in range(min,max,(int(1e3))):
            buff=self.data_collector(center)
            print(buff)
        
    def data_collector(self,center):
        self.sdr.center_freq=center
        samples=self.sdr.read_samples(256*1024)
        sleep(0.2)
        return samples
        
if __name__ =="__main__":
    RECEIVER()