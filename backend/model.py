import numpy as np


def fit_line(series):
    """Fit a linear trend to the sales series and return fitted values plus accuracy metrics."""
    if len(series) < 2:
        fitted = [float(series[-1]) if series else 0.0] * len(series)
        return fitted, 100.0, 0.0

    x = np.arange(len(series))
    y = np.array(series, dtype=float)
    coeffs = np.polyfit(x, y, 1)
    fitted = np.polyval(coeffs, x)

    ss_res = np.sum((y - fitted) ** 2)
    ss_tot = np.sum((y - np.mean(y)) ** 2)
    r2 = 0.0 if ss_tot == 0 else 1.0 - ss_res / ss_tot

    divisor = np.where(np.abs(y) < 1e-6, 1.0, y)
    mape = np.mean(np.abs((y - fitted) / divisor)) * 100.0

    fitted_values = [float(round(float(value), 2)) for value in fitted]
    return fitted_values, float(round(max(0.0, r2) * 100.0, 2)), float(round(mape, 2))


def generate_forecast(series, periods=3):
    """Generate a simple linear trend forecast for the next `periods` values."""
    if len(series) < 2:
        return [float(series[-1]) if series else 0.0] * periods

    x = np.arange(len(series))
    y = np.array(series, dtype=float)
    coeffs = np.polyfit(x, y, 1)
    future_x = np.arange(len(series), len(series) + periods)
    predicted = np.polyval(coeffs, future_x)

    return [float(round(float(value), 2)) for value in predicted]
