import pygame
import random

# Initialiseren van pygame
pygame.init()

# Constanten
SCREEN_WIDTH = 300
SCREEN_HEIGHT = 600
BLOCK_SIZE = 30
GRID_WIDTH = SCREEN_WIDTH // BLOCK_SIZE
GRID_HEIGHT = SCREEN_HEIGHT // BLOCK_SIZE
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Functie om een nieuw Tetris-blok te maken
def new_block():
    shapes = [
        [[1, 1, 1, 1]],  # I
        [[1, 1, 1], [0, 1, 0]],  # T
        [[1, 1, 1], [1, 0, 0]],  # L
        [[1, 1, 1], [0, 0, 1]],  # J
        [[0, 1, 1], [1, 1, 0]],  # S
        [[1, 1], [1, 1]],  # O
        [[1, 1, 0], [0, 1, 1]],  # Z
    ]
    return random.choice(shapes)

# Functie om een blok te tekenen
def draw_block(surface, x, y, block):
    for row in range(len(block)):
        for col in range(len(block[row])):
            if block[row][col] == 1:
                pygame.draw.rect(surface, WHITE, (x + col * BLOCK_SIZE, y + row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE), 0)

# Functie om het speelveld te maken
def create_grid(locked_positions={}):
    grid = [[BLACK for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]

    for y in range(GRID_HEIGHT):
        for x in range(GRID_WIDTH):
            if (x, y) in locked_positions:
                grid[y][x] = locked_positions[(x, y)]

    return grid

# Functie om het spel te draaien
def main():
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    clock = pygame.time.Clock()
    locked_positions = {}
    grid = create_grid(locked_positions)
    current_block = new_block()
    fall_time = 0
    fall_speed = 0.5

    while True:
        screen.fill(BLACK)

        fall_time += clock.get_rawtime()
        clock.tick()

        # Beweging van het huidige blok
        if fall_time / 1000 > fall_speed:
            fall_time = 0
            current_block_y = 0
            current_block_x = GRID_WIDTH // 2 - len(current_block[0]) // 2

            if not valid_space(current_block, grid, current_block_x, current_block_y):
                break

            while valid_space(current_block, grid, current_block_x, current_block_y):
                current_block_y += 1

            current_block_y -= 1

        grid = create_grid(locked_positions)
        draw_block(screen, current_block_x * BLOCK_SIZE, current_block_y * BLOCK_SIZE, current_block)

        pygame.display.update()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()

# Functie om te controleren of een ruimte geldig is
def valid_space(shape, grid, x, y):
    for row in range(len(shape)):
        for col in range(len(shape[row])):
            if shape[row][col] == 1:
                if col + x < 0 or col + x >= GRID_WIDTH or row + y >= GRID_HEIGHT:
                    return False
                if grid[row + y][col + x] != BLACK:
                    return False
    return True

if __name__ == "__main__":
    main()
