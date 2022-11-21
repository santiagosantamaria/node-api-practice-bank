Practice - 1

Issue 1
- Como cliente de un banco quiero crear una cuenta.
- El cliente se da de alta con nombre, apellido y dni (no usar DNI como clave primaria)
- La cuenta se crea con un número de 16 dígitos numéricos que se le asigna
automáticamente.
- El número debe ser único, no puede repetirse en la base de datos.
- Testear que al registrarse un nuevo cliente automáticamente se le asigna una cuenta.

Issue 2
- Como titular de la cuenta quiero conocer los últimos movimientos de mi cuenta. Por
defecto la API siempre devolverá los últimos 10 movimientos del cliente. Un
movimiento es un registro que tiene descripción, fecha y monto. La descripción es un
texto de hasta 100 caracteres, por ejemplo "Extracción cajero automático". El monto es
un número que puede ser negativo.
- Crear un seeder para generar operaciones de ejemplo que sirvan para el siguiente
punto.
- Crear un endpoint para consultar los últimos movimientos de un usuario pasando el
clientId por queryString.
- Testear que siempre devuelva hasta 10 resultados (puede devolver menos si es que aún
no tuvo suficientes movimientos)


Issue 3
- Como titular de la cuenta quiero retirar dinero
- El banco impone un límite de 1000 pesos por extracción para todos los clientes
- Crear un endpoint que permita solicitar una extracción (usar POST)
- En caso que el monto solicitado exceda el limite, enviar una excepción
- Testear que lance la excepción al intentar retirar más del límite
- Testear que apruebe la operación en caso que no supere el monto

Issue 4
- Como titular de la cuenta quiero saber cual es mi saldo.
- Crear un endpoint que devuelva el saldo
- Hacer una operación de extracción y testear que el saldo devuelve el resultado con el
valor de la diferencia. Es decir, si la cuenta tenía 10000 pesos inicialmente y se
extrajeron 500 pesos, el saldo actual debe decir 9500.-

Issue 5
- Como titular de una cuenta quiero realizar transferencias hacia otras cuentas.
- Crear un endpoint para transferir indicando el número de 16 dígitos de la cuenta y el
monto a transferir.
- Testear que lanza una excepción si el monto es mayor al saldo de la cuenta.
- Testear que la cuenta A tiene menos saldo que antes de transferir.
- Testear que la cuenta B tiene más saldo que antes de transferir.
