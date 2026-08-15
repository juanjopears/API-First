// Importaciones
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const OpenApiValidator = require('express-openapi-validator');

// Creacion de instancia de express que me permite tener una app y definicion del puerto
const app = express();
const port = 3000;

// Carga la documentacion que tenemos en nuestro yaml
const swaggerDocument = YAML.load('./openapi.yaml')

// Crea un endpoint para ver esa documentacion en una visual organizada
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

// Definir validaciones
app.use(
    OpenApiValidator.middleware({
        apiSpec: swaggerDocument,
        validateRequests: true,
        validateResponses: true,
        ignorePaths: /.*\/docs.*/,
    })
);

// Caputurar errores
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    })
})

// Definir lista de productos para BD de prueba
const products = [
 {
   id: 1,
   name: 'Laptop Gamer',
   description: 'Portátil con rendimiento para juegos y trabajo.',
   price: 1299.99,
   category: 'electronics',
   tags: ['gaming', 'laptop'],
   inStock: true,
   specifications: { brand: 'Dell', processor: 'Intel i7' },
   ratings: [{ score: 5, comment: 'Excelente rendimiento' }],
 },
 {
   id: 2,
   name: 'Clean Code',
   description: 'Libro de programación para mejorar el diseño de software.',
   price: 29.99,
   category: 'books',
   tags: ['programming', 'software'],
   inStock: true,
   specifications: { author: 'Robert C. Martin', pages: '464' },
   ratings: [{ score: 4, comment: 'Muy útil' }],
 },
];
 
// Hacer que mi app empiece a escuchar peticiones en el puerto 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Obtener productos
app.get('/products', (req,res) => {
   res.json(products);
});

// Crear producto
app.post('/products', (req,res) => {
   const product = {
       id: Date.now(),
       ...req.body,
   };

   products.push(product);
   res.status(201).json(product);
});

// Obtener producto a partir de un id
app.get('/products/:id', (req,res) => {
   const productId = parseInt(req.params.id, 10);
   const product = products.find((item) => item.id === productId);

   if (!product) {
       return res.status(404).json({ message: 'Producto no encontrado' });
   }

   res.json(product);
});

// Actualizar producto a partir de id
app.put('/products/:id', (req,res) => {
   const productId = parseInt(req.params.id, 10);
   const productIndex = products.findIndex((item) => item.id === productId);

   if (productIndex === -1) {
       return res.status(404).json({ message: 'Producto no encontrado' });
   }

   const updatedProduct = {
       ...products[productIndex],
       ...req.body,
       id: productId,
   };

   products[productIndex] = updatedProduct;
   res.json(updatedProduct);
});
 
// Crea endpoint de metodo get de ejemplo
app.get('/hello', (req,res) => {
   res.json({ message: 'Hello World'});
});

// Crea endpoint de metodo post para usuario
app.post('/users', (req,res) => {
    const { name, age, email } = req.body;
    const newUser = {
        id: Date.now().toString(),
        name,
        age,
        email
    }
    // Store the user in memory
    users.push(newUser);
    res.status(201).json(newUser);
});

const users = [
  {
    id: 1,
    name: "Juan Perez",
    age: 30,
    email: "juan@example.com",
  },
  {
    id: 2,
    name: "María García",
    age: 25,
    email: "maria@example.com",
  },
  {
    id: 3,
    name: "Carlos López",
    age: 35,
    email: "carlos@example.com",
  },
];

// Endpoint para obtener un usuario por su ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  } 
  
  res.json({
    id: user.id,
    name: user.name
  });
});

// Endpoint para actualizar un usuario por su ID
app.post('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, age, email } = req.body;

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const UpdatedUser = { 
    id: userId, 
    name, 
    age, 
    email 
  };
  users[userIndex] = UpdatedUser;
  res.json(UpdatedUser);
});

