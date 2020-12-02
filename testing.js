const users = [];
const products = [];

const arr = 300000;

for (let index = 0; index < arr.length; index++) {
    console.log(index)
    users.push({ id: index, nombre: `user=${index}` });
}

for (let index = 0; index < arr.length; index++) {
    products.push({
        id: index,
        name: `producto ${index}`,
        user_id: Math.floor(Math.random() * index)
    });

}
console.time(1)
const mix = products.map(x => ({
    ...x,
    user: users.find(use => use.id === x.user_id)
}));

console.log(users)
console.log(products)
console.log('mezclados', mix[0])
console.timeEnd(1)