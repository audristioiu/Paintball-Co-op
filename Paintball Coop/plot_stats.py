import matplotlib.pyplot as plt

inputs_size = [4,8,12,16,20]

battery_consumption = [0.9,1.95,3.01,4,5]

plt.bar(inputs_size,battery_consumption)

plt.ylabel("Battery Consumption(%)")

plt.xlabel("Time elapsed(minutes)")

xtks = [ 0 , 4 , 8 , 12 ,16 ,20]
plt.xticks(xtks)

plt.title("Battery Discharge")

plt.show()