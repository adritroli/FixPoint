import app from "./app";


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Servidor backend FixPoint escuchando en http://localhost:${PORT}`);
});
