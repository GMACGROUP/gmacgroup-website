// Usage: npm i --no-save world-atlas@2 topojson-client d3-geo && node scripts/generate-africa-map.mjs lib/content/africa-map.ts
import fs from 'fs'; import {feature} from 'topojson-client'; import {geoCentroid, geoAzimuthalEqualArea, geoPath} from 'd3-geo';
const topo=JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-110m.json'));
const fc=feature(topo,topo.objects.countries);
const ex=new Set(['Saudi Arabia','Yemen','Oman','Israel','Jordan','Syria','Iraq','Lebanon','Palestine','Cyprus','N. Cyprus','Spain','Portugal','Italy','Greece','Turkey','Iran','United Arab Emirates','Qatar','Kuwait','Bahrain','Malta','Gibraltar','Saint Helena','Seychelles','Mauritius','Cabo Verde','Comoros','São Tomé and Principe']);
const af=fc.features.filter(f=>{const [x,y]=geoCentroid(f);return x>-26&&x<60&&y>-40&&y<38&&!ex.has(f.properties.name)});
const W=560,H=600;
const proj=geoAzimuthalEqualArea().rotate([-18,-2]).fitExtent([[8,8],[W-8,H-8]],{type:'FeatureCollection',features:af});
const path=geoPath(proj).digits(1);
const focus=["Ghana","Nigeria","Tanzania","Botswana","Rwanda","Malawi","Zambia","Togo","Côte d'Ivoire","Cameroon"];
const team=["Ghana","Nigeria","Zambia","Zimbabwe","Rwanda","Tanzania","Cameroon","Burkina Faso","Botswana"];
const label={"Côte d'Ivoire":"Côte d’Ivoire"};
const out=af.map(f=>{const n=f.properties.name;const c=proj(geoCentroid(f));
 return {name:label[n]||n,d:path(f),focus:focus.includes(n),team:team.includes(n),cx:+c[0].toFixed(1),cy:+c[1].toFixed(1)}});
const miss=[...focus,...team].filter(n=>!af.some(f=>f.properties.name===n)); if(miss.length) console.error('MISSING',miss);
const ts=`// Generated from Natural Earth (public domain) via world-atlas, azimuthal equal-area projection.
// Do not edit by hand. Regenerate with scripts/generate-africa-map.mjs if the market list changes.
export type MapCountry = { name: string; d: string; focus: boolean; team: boolean; cx: number; cy: number };
export const MAP_WIDTH = ${W};
export const MAP_HEIGHT = ${H};
export const AFRICA: MapCountry[] = ${JSON.stringify(out)};
`;
fs.writeFileSync(process.argv[2],ts); console.log('bytes',ts.length);
