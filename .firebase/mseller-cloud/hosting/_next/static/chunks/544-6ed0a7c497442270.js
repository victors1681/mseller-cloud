"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[544],{60155:function(e,i,t){var l=t(85893),r=t(67294),n=t(69661),s=t(2734),o=t(41796),a=t(50591);let c=(0,r.forwardRef)((e,i)=>{let{sx:t,src:r,skin:c,color:d}=e,x=(0,s.Z)(),m=(0,a.Z)(),h=(e,i)=>"light"===e?{...m["".concat(i,"Light")]}:"light-static"===e?{color:m["".concat(i,"Light")].color,backgroundColor:(0,o.$n)(x.palette[i].main,.88)}:{...m["".concat(i,"Filled")]},p={primary:h(c,"primary"),secondary:h(c,"secondary"),success:h(c,"success"),error:h(c,"error"),warning:h(c,"warning"),info:h(c,"info")};return(0,l.jsx)(n.Z,{ref:i,...e,sx:!r&&c&&d?Object.assign(p[d],t):t})});c.defaultProps={skin:"filled",color:"primary"},i.Z=c},16456:function(e,i,t){var l=t(5152),r=t.n(l);let n=r()(()=>Promise.all([t.e(814),t.e(394)]).then(t.bind(t,47229)),{loadableGenerated:{webpack:()=>[47229]},ssr:!1});i.Z=n},72544:function(e,i,t){t.r(i),t.d(i,{default:function(){return R}});var l=t(85893),r=t(67294),n=t(87357),s=t(86886),o=t(66242),a=t(15861),c=t(54028),d=t(9473),x=t(15775),m=t(50613),h=t(82229),p=t(87819),Z=t(31704),f=t(34666),j=t(52866),u=t(78445),g=t(44267),v=t(63730),y=t(60155),b=t(83321),C=t(67720),P=t(41664),S=t.n(P),W=t(80291);let k=e=>[].map((e,i)=>(0,l.jsx)(s.ZP,{item:!0,xs:6,md:4,children:(0,l.jsxs)(n.Z,{sx:{display:"flex",alignItems:"center"},children:[(0,l.jsx)(y.Z,{variant:"rounded",color:e.color,sx:{mr:3,boxShadow:3},children:(0,l.jsx)(v.Z,{icon:e.icon,fontSize:"1.75rem"})}),(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{variant:"caption",children:e.title}),(0,l.jsx)(a.Z,{variant:"h6",children:e.stats})]})]},i)},i)),D=e=>{var i,t,r,c,d;return(0,l.jsx)(o.Z,{children:(0,l.jsx)(W.Z,{isLoading:e.isLoading,children:(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(u.Z,{title:(0,l.jsx)(b.Z,{sx:{mb:2},component:S(),startIcon:(0,l.jsx)(v.Z,{icon:"ep:back"}),variant:"text",href:"/apps/collections/list",children:"Regresar Depositos"}),titleTypographyProps:{sx:{lineHeight:"2rem !important",letterSpacing:"0.15px !important"}}}),(0,l.jsx)(g.Z,{children:(0,l.jsxs)(s.ZP,{container:!0,children:[(0,l.jsx)(s.ZP,{item:!0,xs:6,md:6,children:(0,l.jsx)(n.Z,{sx:{mr:2,display:"flex",alignItems:"center"},children:(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{variant:"body2",children:"No. Deposito"}),(0,l.jsx)(a.Z,{variant:"h6",children:null===(i=e.collection)||void 0===i?void 0:i.noDepositoStr})]})})}),(0,l.jsx)(s.ZP,{item:!0,xs:6,md:6,children:(0,l.jsx)(n.Z,{sx:{mr:2,display:"flex",alignItems:"center"},children:(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{variant:"body2",children:"Distribuidor"}),(0,l.jsx)(a.Z,{variant:"h6",children:null===(t=e.collection)||void 0===t?void 0:t.notaDeposito})]})})}),(0,l.jsx)(s.ZP,{item:!0,xs:6,md:6,children:(0,l.jsx)(n.Z,{sx:{mr:2,display:"flex",alignItems:"center"},children:(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{variant:"body2",children:"Status"}),(0,l.jsx)(m.Z,{skin:"light",size:"small",label:f.m[(null===(r=e.collection)||void 0===r?void 0:r.procesado)||0]||"",color:f.J[(null===(c=e.collection)||void 0===c?void 0:c.procesado)||""],sx:{textTransform:"capitalize"}})]})})}),(0,l.jsx)(s.ZP,{item:!0,xs:6,md:6,children:(0,l.jsx)(n.Z,{sx:{mr:2,display:"flex",alignItems:"center"},children:(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{variant:"body2",children:"Fecha"}),(0,l.jsx)(a.Z,{variant:"h6",children:(0,p.Z)((null===(d=e.collection)||void 0===d?void 0:d.fecha)||"")})]})})}),(0,l.jsx)(s.ZP,{item:!0,xs:12,md:12,children:(0,l.jsx)(C.Z,{sx:{mt:5,mb:5}})}),k(e.collection)]})})]})})})};var I=t(2734),w=t(16456),z=t(25812),L=t(4988);let T=e=>{let i=null==e?void 0:e.recibos.filter(e=>e.tipoPago===L.W.Efectivo),t=i.reduce((e,i)=>e+=i.totalCobro,0),l=null==e?void 0:e.recibos.filter(e=>e.tipoPago===L.W.Cheque),r=l.reduce((e,i)=>e+=i.totalCobro,0),n=null==e?void 0:e.recibos.filter(e=>e.tipoPago===L.W.Transferencia),s=n.reduce((e,i)=>e+=i.totalCobro,0),o=null==e?void 0:e.recibos.filter(e=>!0===e.ckFuturista),a=o.reduce((e,i)=>e+=i.totalCobro,0),c=null==e?void 0:e.totalCobrado,d=null==e?void 0:e.recibos.length,x=[i.length,l.length,o.length,n.length];return{total:c,cash:t,check:r,ckFuturist:a,transfer:s,donut:x,totalDocs:d}},E=e=>{let i=(0,I.Z)(),t=!e.isLoading&&T(e.collection)||{},c=r.useCallback(()=>({chart:{sparkline:{enabled:!0}},colors:[i.palette.primary.main,(0,z.E)(i.palette.primary.main,.7),(0,z.E)(i.palette.primary.main,.5),i.palette.customColors.trackBg],stroke:{width:0},legend:{show:!1},dataLabels:{enabled:!1},labels:["Cheque","Efectivo","Cr\xe9dito","Transferencia"],states:{hover:{filter:{type:"none"}},active:{filter:{type:"none"}}},plotOptions:{pie:{customScale:.9,donut:{size:"70%",labels:{show:!0,name:{offsetY:25,fontSize:"0.875rem",color:i.palette.text.secondary},value:{offsetY:-15,fontWeight:500,formatter:e=>"".concat(e),color:i.palette.text.primary},total:{show:!0,fontSize:"0.875rem",label:"Total Cobros",color:i.palette.text.secondary,formatter:e=>"".concat(e.globals.seriesTotals.reduce((e,i)=>e+i))}}}}}}),[t]);return(0,l.jsx)(o.Z,{children:(0,l.jsxs)(W.Z,{isLoading:e.isLoading,children:[(0,l.jsx)(u.Z,{title:"Cobros",titleTypographyProps:{sx:{lineHeight:"1.5rem !important",letterSpacing:"0.15px !important"}}}),(0,l.jsx)(g.Z,{children:(0,l.jsxs)(s.ZP,{container:!0,sx:{my:[0,4,3]},children:[(0,l.jsx)(s.ZP,{item:!0,xs:12,sm:6,sx:{mb:[3,0]},children:(0,l.jsx)(w.Z,{type:"donut",height:200,series:t.donut,options:c()})}),(0,l.jsxs)(s.ZP,{item:!0,xs:12,sm:6,sx:{my:"auto"},children:[(0,l.jsxs)(n.Z,{sx:{mr:2,display:"flex",alignItems:"center"},children:[(0,l.jsx)(y.Z,{skin:"light",variant:"rounded",sx:{mr:3,"& svg":{color:"primary.main"}},children:(0,l.jsx)(v.Z,{icon:"mdi:currency-usd"})}),(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{variant:"body2",children:"Total Cobros"}),(0,l.jsx)(a.Z,{variant:"h6",children:(0,Z.Z)(t.total)})]})]}),(0,l.jsx)(C.Z,{sx:{my:e=>"".concat(e.spacing(4)," !important")}}),(0,l.jsxs)(s.ZP,{container:!0,children:[(0,l.jsxs)(s.ZP,{item:!0,xs:6,sx:{mb:4},children:[(0,l.jsxs)(n.Z,{sx:{mb:1.5,display:"flex",alignItems:"center","& svg":{mr:1.5,fontSize:"0.75rem",color:"primary.main"}},children:[(0,l.jsx)(v.Z,{icon:"mdi:circle"}),(0,l.jsx)(a.Z,{variant:"body2",children:"Efectivo"})]}),(0,l.jsx)(a.Z,{sx:{fontWeight:600},children:(0,Z.Z)(t.cash)})]}),(0,l.jsxs)(s.ZP,{item:!0,xs:6,sx:{mb:4},children:[(0,l.jsxs)(n.Z,{sx:{mb:1.5,display:"flex",alignItems:"center","& svg":{mr:1.5,fontSize:"0.75rem",color:(0,z.E)(i.palette.primary.main,.7)}},children:[(0,l.jsx)(v.Z,{icon:"mdi:circle"}),(0,l.jsx)(a.Z,{variant:"body2",children:"Cheque"})]}),(0,l.jsx)(a.Z,{sx:{fontWeight:600},children:(0,Z.Z)(t.check)})]}),(0,l.jsxs)(s.ZP,{item:!0,xs:6,children:[(0,l.jsxs)(n.Z,{sx:{mb:1.5,display:"flex",alignItems:"center","& svg":{mr:1.5,fontSize:"0.75rem",color:(0,z.E)(i.palette.primary.main,.5)}},children:[(0,l.jsx)(v.Z,{icon:"mdi:circle"}),(0,l.jsx)(a.Z,{variant:"body2",children:"Transferencia"})]}),(0,l.jsx)(a.Z,{sx:{fontWeight:600},children:(0,Z.Z)(t.transfer)})]}),(0,l.jsxs)(s.ZP,{item:!0,xs:6,children:[(0,l.jsxs)(n.Z,{sx:{mb:1.5,display:"flex",alignItems:"center","& svg":{mr:1.5,fontSize:"0.75rem",color:"customColors.trackBg"}},children:[(0,l.jsx)(v.Z,{icon:"mdi:circle"}),(0,l.jsx)(a.Z,{variant:"body2",children:"Cheque futurista"})]}),(0,l.jsx)(a.Z,{sx:{fontWeight:600},children:(0,Z.Z)(t.ckFuturist)})]})]})]})]})})]})})},N=[{flex:.15,field:"id",minWidth:120,headerName:"#",renderCell:e=>{let{row:i}=e;return(0,l.jsx)(j.default,{title:i.noDepositoStr,data:i})}},{flex:.25,minWidth:250,field:"client",headerName:"Cliente",renderCell:e=>{let{row:i}=e;return(0,l.jsx)(n.Z,{sx:{display:"flex",alignItems:"center"},children:(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{noWrap:!0,variant:"body2",sx:{color:"text.primary",textTransform:"capitalize"},children:i.cliente.nombre}),(0,l.jsx)(a.Z,{noWrap:!0,variant:"caption",children:i.cliente.codigo})]})})}},{flex:.25,field:"driver",minWidth:200,headerName:"Vendedor",renderCell:e=>{let{row:i}=e;return(0,l.jsx)(n.Z,{sx:{display:"flex",alignItems:"center"},children:(0,l.jsxs)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(a.Z,{noWrap:!0,variant:"body2",sx:{color:"text.primary",fontWeight:600},children:i.vendedor.nombre}),(0,l.jsx)(a.Z,{noWrap:!0,variant:"caption",children:i.vendedor.codigo})]})})}},{flex:.15,field:"location",minWidth:100,headerName:"Total",renderCell:e=>{let{row:i}=e;return(0,l.jsx)(n.Z,{sx:{display:"flex",alignItems:"center"},children:(0,l.jsx)(n.Z,{sx:{display:"flex",flexDirection:"column"},children:(0,l.jsx)(a.Z,{noWrap:!0,variant:"body2",sx:{color:"text.primary",textTransform:"capitalize"},children:(0,Z.Z)(i.totalCobro)})})})}},{flex:.18,minWidth:150,field:"date",headerName:"Fecha",renderCell:e=>{let{row:i}=e;return(0,l.jsx)(a.Z,{variant:"body2",children:(0,p.Z)(i.fecha)})}},{flex:.1,minWidth:120,field:"status",headerName:"Status",renderCell:e=>{let{row:i}=e;return(0,l.jsx)(m.Z,{skin:"light",size:"small",label:f.m[null==i?void 0:i.procesado]||"",color:f.J[i.procesado],sx:{textTransform:"capitalize"}})}}],F=e=>{var i;let[t,a]=(0,r.useState)([]),[m,p]=(0,r.useState)(""),[Z,f]=(0,r.useState)(""),[j,u]=(0,r.useState)(null),[g,v]=(0,r.useState)([]),[y,b]=(0,r.useState)(null),[C,P]=(0,r.useState)({page:0,pageSize:20}),S=(0,d.I0)(),W=(0,d.v9)(e=>e.collections);console.log("storestorestore",W),(0,r.useEffect)(()=>{S((0,x.AG)(e.noDeposito))},[S,Z,m,t]);let k=[...N,{flex:.1,minWidth:130,sortable:!1,field:"actions",headerName:"Actions",renderCell:e=>{let{row:i}=e;return(0,l.jsx)(n.Z,{sx:{display:"flex",alignItems:"center"}})}}];return(0,l.jsx)(h.Z,{children:(0,l.jsxs)(s.ZP,{container:!0,spacing:6,children:[(0,l.jsx)(s.ZP,{item:!0,xs:6,children:(0,l.jsx)(D,{collection:W.collectionData,isLoading:W.isLoading})}),(0,l.jsx)(s.ZP,{item:!0,xs:6,children:(0,l.jsx)(E,{collection:W.collectionData,isLoading:W.isLoading})}),(0,l.jsx)(s.ZP,{item:!0,xs:12,children:(0,l.jsx)(o.Z,{children:(0,l.jsx)(c._,{autoHeight:!0,pagination:!0,rows:(null===(i=W.collectionData)||void 0===i?void 0:i.recibos)||[],columns:k,disableRowSelectionOnClick:!0,paginationModel:C,onPaginationModelChange:P,onRowSelectionModelChange:e=>v(e),getRowId:e=>e.noReciboStr,loading:W.isLoading})})})]})})};var R=F},80291:function(e,i,t){t.d(i,{Z:function(){return a}});var l=t(85893),r=t(87357),n=t(98456),s=t(15861);let o=e=>{let{isLoading:i,children:t}=e;return i?(0,l.jsxs)(r.Z,{sx:{mt:11,mb:11,width:"100%",display:"flex",alignItems:"center",flexDirection:"column"},children:[(0,l.jsx)(n.Z,{sx:{mb:4}}),(0,l.jsx)(s.Z,{variant:"caption",children:"Cargando..."})]}):(0,l.jsx)(l.Fragment,{children:t})};var a=o}}]);