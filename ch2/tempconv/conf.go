package tempconv

func CtoF(c Celsius) Fahrenheit {
	return Fahrenheit(c*9/5 + 32)
}

func FtoC(f Fahrenheit) Celsius {
	return Celsius((f - 32) * 5 / 9)
}

func CtoK(c Celsius) Kelvin {
	return Kelvin(c + (-1)*AbsoluteZeroC)
}

func KtoC(k Kelvin) Celsius {
	return Celsius(k + FreezingK)
}
