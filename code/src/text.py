import os
from src.colors import colors
def print_text():
    ''' Clear screen and print shell text '''
    os.system('clear')
    print(colors.purple + '       .__      _________.__           .__  .__   ')
    print('  _____|  |    /   _____/|  |__   ____ |  | |  |  ')
    print(' /  ___/  |    \\_____  \\ |  |  \\_/ __ \\|  | |  |  ')
    print(' \___ \\|  |__  /        \\|   Y  \\  ___/|  |_|  |__')
    print('/____  >____/ /_______  /|___|  /\\___  >____/____/')
    print('     \\/               \\/      \\/     \\/           ' + colors.default)
    print('An interactive sentential logic shell\n')
