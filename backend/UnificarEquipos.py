import pandas as pd

# Definir las rutas de los archivos Excel
file1 = 'España-primera - equipos.xlsx'
file2 = 'España-primera_division_rfef - equipos.xlsx'
file3 = 'España-segunda - equipos.xlsx'

# Leer cada archivo Excel y agregar la columna de competición
df1 = pd.read_excel(file1)
df1['Competicion'] = 'LaLiga EA Sports'

df2 = pd.read_excel(file3)
df2['Competicion'] = 'LaLiga Hypermotion'

df3 = pd.read_excel(file2)
df3['Competicion'] = '1ª RFEF'

# Unificar los DataFrames
df_unificado = pd.concat([df1, df2, df3], ignore_index=True)

# Eliminar duplicados basados en la URL del jugador, asumiendo que es un identificador único
df_unificado.drop_duplicates(subset='URL', keep='last', inplace=True)

# Guardar el DataFrame unificado en un nuevo archivo Excel
df_unificado.to_excel('equipos_unificado.xlsx', index=False)
