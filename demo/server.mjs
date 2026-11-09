import { createServer } from 'node:http';

const broken = process.env.WEB_FLOW_BROKEN === '1';

function page(title, content) {
  return `<!doctype html>
<html lang="es">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
  body { color: #172637; background: #f6f8fb; font: 1rem/1.6 system-ui, sans-serif; margin: 0; }
  main { max-width: 40rem; margin: 10vh auto; padding: 1.5rem 2rem; }
  a { color: #1349ad; }
  button, input { font: inherit; padding: .35rem .6rem; }
</style>
<main><h1>${title}</h1>${content}</main>
</html>`;
}

const catalog = page('Tienda de prueba', `
  <h2>Cuaderno</h2>
  <p>Precio unitario · S/ 30.00</p>
  <button id="add" type="button">Agregar cuaderno al carrito</button>
  <section id="cart" hidden>
    <h2>Carrito</h2>
    <label for="quantity">Cantidad</label>
    <input id="quantity" type="number" min="1" value="1">
    <p><output id="subtotal" aria-label="Subtotal">S/ 30.00</output></p>
  </section>
  <script>
    const cart = document.querySelector('#cart');
    const quantity = document.querySelector('#quantity');
    const subtotal = document.querySelector('#subtotal');
    document.querySelector('#add').addEventListener('click', () => { cart.hidden = false; });
    quantity.addEventListener('input', () => {
      const units = ${broken ? '1' : 'quantity.valueAsNumber'};
      subtotal.value = 'S/ ' + (30 * units).toFixed(2);
    });
  </script>
`);

const routes = new Map([
  ['/', page('Demos locales', '<a href="/portafolio">Portafolio</a> · <a href="/tienda">Tienda</a>')],
  ['/portafolio', page('Portafolio de prueba',
    `<a href="${broken ? '/portafolio/inexistente' : '/portafolio/huerto'}">Ver proyecto Huerto</a>`)],
  ['/portafolio/huerto', page('Huerto', '<p>Registro de siembra para huertos urbanos.</p>')],
  ['/tienda', catalog],
]);

createServer((request, response) => {
  const path = new URL(request.url, 'http://127.0.0.1').pathname;
  const html = routes.get(path);
  response.writeHead(html ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(html ?? page('Página no encontrada', '<a href="/">Volver a las demos</a>'));
}).listen(4176, '127.0.0.1');