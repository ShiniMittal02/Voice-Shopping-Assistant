const express = require('express'), path = require('path');
const app = express(), PORT = 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`✅ Server at http://localhost:${PORT}`));
