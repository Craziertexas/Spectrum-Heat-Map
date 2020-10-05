from pylab import *
from rtlsdr import *
from time import sleep
import asyncio

class RECEIVER():
    
    def __init__(self):
        
        self.loop=asyncio.get_event_loop()
        self.loop.create_task(self.manager())
        self.loop.run_forever()
        
        for i in range(0,100,1):
            sleep(1)
            print("Zzzzz")
        
    async def manager(self):
        
        try:
            min=int(input("Enter the min frequency"))
            max=int(input("Enter the max frequency"))
        except:
            print("Wrong numbers, taking defaul values")
            min=int(100e6)
            max=int(200e6)
             
        self.sdr= RtlSdr()
        self.sdr.gain=4
        self.sdr.sample_rate=2.4e6
        
        for center in range(min,max,(int(10e6))):
            buff=await self.data_collector(center)
            psd(buff, NFFT=1024, Fs=self.sdr.sample_rate/1e6, Fc=self.sdr.center_freq/1e6)
            xlabel('Frequency (MHz)')
            ylabel('Relative power (dB)')
            show()
        
        self.sdr.close()
        self.loop.stop()
        
    async def data_collector(self,center):
        
        self.sdr.center_freq=center
        samples=self.sdr.read_samples(256*1024)
        return samples
        
if __name__ =="__main__":
    RECEIVER()