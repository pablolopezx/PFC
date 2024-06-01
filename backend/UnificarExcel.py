import pandas as pd

# Cargar los tres archivos Excel, cada uno correspondiente al scrapeo de una liga(1ª División, 2ª División, 1ªRFEF)
file1 = 'España-primera - .xlsx'
file2 = 'España-primera_division_rfef.xlsx'
file3 = 'España-segunda - .xlsx'

# Leer los datos de los archivos Excel y agregar la columna 'Competicion'
df1 = pd.read_excel(file1)
df1['Competicion'] = 'LaLiga EA Sports'

df2 = pd.read_excel(file2)
df2['Competicion'] = '1ª RFEF'

df3 = pd.read_excel(file3)
df3['Competicion'] = 'LaLiga Hypermotion'

# Unir los tres DataFrames
combined_df = pd.concat([df1, df2, df3])

# Eliminar filas duplicadas basadas en la columna 'URL'
# Asegúrate de reemplazar 'URL' con el nombre exacto de la columna que contiene las URLs en tus archivos
unique_df = combined_df.drop_duplicates(subset='URL')

# Guardar el DataFrame resultante en un nuevo archivo Excel
unique_df.to_excel('archivo_unificado.xlsx', index=False)

print("Los archivos han sido unificados, la columna 'Competicion' ha sido agregada y las filas duplicadas han sido eliminadas.")
