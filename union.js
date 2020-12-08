import { readFileSync, writeFileSync } from 'fs';


class union {
    async readFiles(path) {
        let jsonDetail = readFileSync(path)
        return JSON.parse(jsonDetail);
    }

    async tigie() {
        const fractionDescription = await this.readFiles('./fracciones TIGIE.json');
        return fractionDescription;
    }

    async fraction() {
        const fraction = await this.readFiles('./fracciones.json');
        return fraction;
    }
    async unionFraction() {
        const fraction = await this.fraction();
        const tigie = await this.tigie();
        // console.log(await fraction, await tigie)
        const union = tigie.map((ele) => ({ fraccionVieja: ele.fraccionVieja, fraccionNueva: ele.fraccionNueva, nico: ele.nico, descripcion: fraction[ele.fraccionIndice].description }))
        this.writeFile(union, 'fracciones-daniel');
    }

    writeFile(data, name) {
        writeFileSync(`${name}.json`, JSON.stringify(data))
        console.log('terminado')
    }
}


const m = new union;
m.unionFraction();