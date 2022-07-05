import matplotlib.pyplot as plt
import numpy as np

inputs_size = [10,50,100,500,1000]

times_msg = [0.3,0.45,0.6,0.75,0.9]
times_fs = [2.8,2.56,2.26,3.42,2.72]

plt.figure(1)

plt.plot(inputs_size, times_msg, label = "Messaging API")
plt.plot(inputs_size, times_fs, label = "File-Transfer API")

plt.xticks(np.arange(0, 1001, 100))
plt.xlim(0,1000)

plt.xlabel('Packet size')
plt.ylabel('Execution time')
plt.legend()
plt.title("Communication comparison")
plt.show()
