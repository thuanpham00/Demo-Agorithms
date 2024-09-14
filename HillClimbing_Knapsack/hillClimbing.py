import numpy as np
import matplotlib.pyplot as plt

# Hàm số đơn giản để tối ưu hóa (parabol)
def f(x):
    return -x**2 + 4*x

# Hill Climbing tìm cực đại của hàm f(x)
def hill_climbing(start, step_size=0.1, max_steps=100):
    current_x = start
    for step in range(max_steps):
        # Xem xét vị trí lân cận
        next_x = current_x + step_size
        prev_x = current_x - step_size
        
        # Tính giá trị hàm f(x) tại các vị trí
        current_y = f(current_x)
        next_y = f(next_x)
        prev_y = f(prev_x)
        
        # Nếu vị trí lân cận tốt hơn, di chuyển đến đó
        if next_y > current_y:
            current_x = next_x
        elif prev_y > current_y:
            current_x = prev_x
        else:
            break  # Nếu không có vị trí nào tốt hơn, dừng lại
    return current_x

# Khởi tạo giá trị ban đầu và chạy Hill Climbing
start_x = np.random.uniform(0, 4)
optimal_x = hill_climbing(start_x)

# Vẽ đồ thị
x = np.linspace(0, 4, 400)
y = f(x)

plt.plot(x, y, label="f(x) = -x^2 + 4x")
plt.scatter([optimal_x], [f(optimal_x)], color='red', zorder=5, label="Đỉnh cực đại tìm được")
plt.scatter([start_x], [f(start_x)], color='green', zorder=5, label="Khởi tạo ban đầu")
plt.title("Minh hoạ Hill Climbing")
plt.xlabel("x")
plt.ylabel("f(x)")
plt.legend()
plt.show()

print("Giá trị x tối ưu tìm được:", optimal_x)