const NOISE = /* glsl */ `
float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){
  vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p*=2.02;a*=.5;}return s;}
`;

const SURFACE_VS = /* glsl */ `
varying vec3 vN; varying vec3 vW; varying vec3 vO;
void main(){
  vO=normalize(position);
  vN=normalize(mat3(modelMatrix)*normal);
  vec4 w=modelMatrix*vec4(position,1.);
  vW=w.xyz;
  gl_Position=projectionMatrix*viewMatrix*w;
}`;

export const PLANET_VS = SURFACE_VS;

export const PLANET_FS = /* glsl */ `
uniform vec3 uSun;
varying vec3 vN; varying vec3 vW; varying vec3 vO;
${NOISE}
void main(){
  vec3 N=normalize(vN),L=normalize(uSun),V=normalize(cameraPosition-vW);
  float h=fbm(vO*2.3+vec3(3.1,1.7,.4));
  float sea=.5;
  vec3 deepSea=vec3(.015,.11,.17),shallow=vec3(.03,.36,.43);
  vec3 rust=vec3(.5,.23,.13),peak=vec3(.8,.57,.37);
  bool land=h>sea;
  vec3 base=land?mix(rust,peak,smoothstep(sea,.72,h)):mix(deepSea,shallow,smoothstep(.2,sea,h));
  float ice=smoothstep(.8,.9,abs(vO.y)+(h-.5)*.25);
  base=mix(base,vec3(.9,.95,1.),ice);
  if(ice>.5)land=true;
  float d=max(dot(N,L),0.);
  vec3 col=base*(.05+d*1.15);
  if(!land){vec3 R=reflect(-L,N);col+=vec3(.6,.8,.9)*pow(max(dot(R,V),0.),48.)*.7*d;}
  float night=smoothstep(.12,-.02,dot(N,L));
  float city=step(.8,noise(vO*38.))*step(.5,h)*step(h,.62)*(1.-ice);
  col+=vec3(1.,.62,.25)*city*night*1.5;
  col+=vec3(.9,.35,.15)*pow(1.-abs(dot(N,L)),6.)*.05;
  gl_FragColor=vec4(col,1.);
}`;

export const CLOUD_FS = /* glsl */ `
uniform vec3 uSun; uniform float uTime;
varying vec3 vN; varying vec3 vW; varying vec3 vO;
${NOISE}
void main(){
  vec3 N=normalize(vN),L=normalize(uSun);
  float c=fbm(vO*3.2+vec3(uTime*.02,0.,uTime*.015));
  float a=smoothstep(.55,.8,c);
  float d=max(dot(N,L),0.);
  gl_FragColor=vec4(vec3(1.)*(.05+d*1.1),a*.85);
}`;

export const ATMO_VS = /* glsl */ `
varying vec3 vNv; varying vec3 vNw;
void main(){
  vNv=normalize(normalMatrix*normal);
  vNw=normalize(mat3(modelMatrix)*normal);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}`;

export const ATMO_FS = /* glsl */ `
uniform vec3 uSun;
varying vec3 vNv; varying vec3 vNw;
void main(){
  float d=-dot(normalize(vNv),vec3(0.,0.,1.));
  float i=pow(.7+d,4.)*smoothstep(0.,.35,d);
  float lit=.25+.9*max(dot(normalize(vNw),normalize(uSun)),0.);
  gl_FragColor=vec4(vec3(.3,.85,.9)*i*lit*.5,1.);
}`;

export const SKY_VS = /* glsl */ `
varying vec3 vD;
void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

export const SKY_FS = /* glsl */ `
uniform float uTime;
varying vec3 vD;
${NOISE}
void main(){
  vec3 d=normalize(vD);
  float n=fbm(d*2.4+vec3(0.,0.,uTime*.003));
  float m=fbm(d*5.+7.);
  vec3 col=vec3(.012,.016,.04);
  col+=vec3(.1,.05,.2)*smoothstep(.45,.85,n)*.9;
  col+=vec3(.02,.12,.17)*smoothstep(.5,.9,m)*.7;
  gl_FragColor=vec4(col,1.);
}`;
