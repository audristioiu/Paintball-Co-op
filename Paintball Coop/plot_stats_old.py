import numpy as np
from scipy.stats import norm

import matplotlib.pyplot as plt
import seaborn as sns

np.set_printoptions(linewidth=130)

sns.set_context("paper", font_scale=1.5)

# Distribution
X = [0.7,0.9,1,1.1,1.2]

mean = np.mean(X)
var = np.var(X)
std = np.std(X)

print("Mean:", mean)
print("Variance:", var)
print("Standard Deviation:", std)

plt.figure(figsize=(10, 5))

ax = sns.kdeplot(X, shade=True)

x = np.linspace(mean - std, mean + std)
y = norm.pdf(x, mean, std)
ax.fill_between(x, y, alpha=0.5)

plt.xlabel("Random variable X")
plt.ylabel("Probability Density Function\n(Battery Power Consumption)")
plt.xticks(ticks=range(0, 2))
plt.grid()

plt.show()