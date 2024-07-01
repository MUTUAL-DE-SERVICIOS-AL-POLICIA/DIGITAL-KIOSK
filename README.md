# INSTALL SOFTWARE PROCEDURES CONSULTATION POINT

## Requirements

- Node use >=v20.5.0
- npm 9.8.0

## Dependencies

- Create **public** folder.
- Copy the **models** folder to the public folder.

## Configuration the .env file

- Set the environment variable *VITE_HOST_BACKEND* with **STI_BACKEND** service.
- Set the enviroment variable *VITE_HOST_BACKEND_PRINT* with **PRINT** service.
- Set the *VITE_ACTIVITY_TIME* environment variable with time for the application timer.
- Set the *VITE_MAC_DEVICE* environment variable with the device key.
- Set up the printer.

## Despligue con docker
PASO 1: Copiar el proyecto de github
```
git clone git@github.com:MUTUAL-DE-SERVICIOS-AL-POLICIA/DIGITAL-KIOSK.git
```
PASO 2: Construir la imagen con:
```
docker build -t <nombre de la imagen>:v1 .
```
PASO 3: ejecutar el contenedor con:
```
docker run -d -p 4001:4001 -v <ruta del proyecto>:<ruta en el contendor> <nombre de la imagen>
```
