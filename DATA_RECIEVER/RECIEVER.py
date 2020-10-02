from pylab import *
from rtlsdr import *

class RECEIVER():
    
    def __init__(self):
        
        self.sdr= RtlSdr()
        self.sdr.gain=4
        self.sdr.sample_rate=2.4e6
        min=input("Enter the min frequency")
        max=input("Enter the max frequency")
        
        for center in range(min,max):
            self.data_collector(center)
            center=center+(1e3)
        
    def data_collector(self,center):
        self.sdr.center_freq(center)
        samples=self.sdr.read_samples(256*1024)
        
        
if __name__ =="__main__":
    RECEIVER()