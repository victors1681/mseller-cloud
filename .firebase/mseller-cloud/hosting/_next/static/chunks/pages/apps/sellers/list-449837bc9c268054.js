(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[507],{78445:function(e,t,r){"use strict";r.d(t,{Z:function(){return C}});var a=r(63366),n=r(87462),i=r(67294),o=r(86010),l=r(94780),s=r(15861),d=r(71657),c=r(90948),u=r(1588),p=r(34867);function h(e){return(0,p.Z)("MuiCardHeader",e)}let x=(0,u.Z)("MuiCardHeader",["root","avatar","action","content","title","subheader"]);var m=r(85893);let f=["action","avatar","className","component","disableTypography","subheader","subheaderTypographyProps","title","titleTypographyProps"],g=e=>{let{classes:t}=e;return(0,l.Z)({root:["root"],avatar:["avatar"],action:["action"],content:["content"],title:["title"],subheader:["subheader"]},h,t)},Z=(0,c.ZP)("div",{name:"MuiCardHeader",slot:"Root",overridesResolver:(e,t)=>(0,n.Z)({[`& .${x.title}`]:t.title,[`& .${x.subheader}`]:t.subheader},t.root)})({display:"flex",alignItems:"center",padding:16}),v=(0,c.ZP)("div",{name:"MuiCardHeader",slot:"Avatar",overridesResolver:(e,t)=>t.avatar})({display:"flex",flex:"0 0 auto",marginRight:16}),b=(0,c.ZP)("div",{name:"MuiCardHeader",slot:"Action",overridesResolver:(e,t)=>t.action})({flex:"0 0 auto",alignSelf:"flex-start",marginTop:-4,marginRight:-8,marginBottom:-4}),j=(0,c.ZP)("div",{name:"MuiCardHeader",slot:"Content",overridesResolver:(e,t)=>t.content})({flex:"1 1 auto"}),y=i.forwardRef(function(e,t){let r=(0,d.Z)({props:e,name:"MuiCardHeader"}),{action:i,avatar:l,className:c,component:u="div",disableTypography:p=!1,subheader:h,subheaderTypographyProps:x,title:y,titleTypographyProps:C}=r,w=(0,a.Z)(r,f),P=(0,n.Z)({},r,{component:u,disableTypography:p}),N=g(P),k=y;null==k||k.type===s.Z||p||(k=(0,m.jsx)(s.Z,(0,n.Z)({variant:l?"body2":"h5",className:N.title,component:"span",display:"block"},C,{children:k})));let S=h;return null==S||S.type===s.Z||p||(S=(0,m.jsx)(s.Z,(0,n.Z)({variant:l?"body2":"body1",className:N.subheader,color:"text.secondary",component:"span",display:"block"},x,{children:S}))),(0,m.jsxs)(Z,(0,n.Z)({className:(0,o.Z)(N.root,c),as:u,ref:t,ownerState:P},w,{children:[l&&(0,m.jsx)(v,{className:N.avatar,ownerState:P,children:l}),(0,m.jsxs)(j,{className:N.content,ownerState:P,children:[k,S]}),i&&(0,m.jsx)(b,{className:N.action,ownerState:P,children:i})]}))});var C=y},12785:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/apps/sellers/list",function(){return r(71792)}])},81010:function(e,t,r){"use strict";var a=r(85893),n=r(67294),i=r(41664),o=r.n(i),l=r(87357),s=r(38333),d=r(67720),c=r(18972),u=r(93946),p=r(63730),h=r(23918);let x=e=>{let{children:t,option:r}=e;return r.href?(0,a.jsx)(l.Z,{component:o(),href:r.href,...r.linkProps,sx:{px:4,py:1.5,width:"100%",display:"flex",color:"inherit",alignItems:"center",textDecoration:"none"},children:t}):(0,a.jsx)(a.Fragment,{children:t})},m=e=>{let{icon:t,options:r,menuProps:i,iconProps:o,leftAlignMenu:l,iconButtonProps:m}=e,[f,g]=(0,n.useState)(null),{settings:Z}=(0,h.r)(),{direction:v}=Z,b=e=>{g(e.currentTarget)},j=()=>{g(null)};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(u.Z,{"aria-haspopup":"true",onClick:b,...m,children:t||(0,a.jsx)(p.Z,{icon:"mdi:dots-vertical",...o})}),(0,a.jsx)(s.Z,{keepMounted:!0,anchorEl:f,onClose:j,open:!!f,...!l&&{anchorOrigin:{vertical:"bottom",horizontal:"ltr"===v?"right":"left"},transformOrigin:{vertical:"top",horizontal:"ltr"===v?"right":"left"}},...i,children:r.map((e,t)=>"string"==typeof e?(0,a.jsx)(c.Z,{onClick:j,children:e},t):"divider"in e?e.divider&&(0,a.jsx)(d.Z,{...e.dividerProps},t):(0,a.jsx)(c.Z,{...e.menuItemProps,...e.href&&{sx:{p:0}},onClick:t=>{j(),e.menuItemProps&&e.menuItemProps.onClick&&e.menuItemProps.onClick(t)},children:(0,a.jsxs)(x,{option:e,children:[e.icon?e.icon:null,e.text]})},t))})]})};t.Z=m},71792:function(e,t,r){"use strict";r.r(t);var a=r(85893),n=r(67294),i=r(41664),o=r.n(i),l=r(86886),s=r(66242),d=r(90948),c=r(78445),u=r(15861),p=r(54028),h=r(57144),x=r(63730),m=r(9473),f=r(31807),g=r(63676),Z=r(82229),v=r(81010);let b=(0,d.ZP)(o())(e=>{let{theme:t}=e;return{textDecoration:"none",color:t.palette.primary.main}}),j=[{flex:.05,field:"id",minWidth:80,headerName:"C\xf3digo",renderCell:e=>{let{row:t}=e;return(0,a.jsx)(b,{href:"#",children:"".concat(t.codigo)})}},{flex:.2,minWidth:130,field:"day",headerName:"Nombre",renderCell:e=>{let{row:t}=e;return(0,a.jsx)(u.Z,{noWrap:!0,variant:"body2",sx:{color:"text.primary",fontWeight:600,textTransform:"capitalize"},children:t.nombre})}},{flex:.05,minWidth:50,field:"status",headerName:"Status",renderCell:e=>{let{row:t}=e;return(0,a.jsx)(u.Z,{variant:"body2",children:t.status})}}],y=()=>{let[e,t]=(0,n.useState)([]),[r,i]=(0,n.useState)(""),[o,d]=(0,n.useState)(""),[u,b]=(0,n.useState)([]),[y,C]=(0,n.useState)({page:0,pageSize:20}),w=(0,m.I0)(),P=(0,m.v9)(e=>e.sellers);(0,n.useEffect)(()=>{w((0,f.rQ)({query:r,pageNumber:y.page}))},[o]);let N=(0,n.useCallback)(e=>{C(e),w((0,f.rQ)({query:r,pageNumber:e.page}))},[y,r,o]),k=(0,n.useCallback)(e=>{w((0,f.rQ)({query:e,pageNumber:y.page}))},[w,o,r,e,y]),S=(0,n.useCallback)((0,h.Z)(e=>{C({page:1,pageSize:20}),k(e)},900),[]),R=(0,n.useCallback)(e=>{S.clear(),i(e),S(e)},[S]),_=[...j];return(0,a.jsx)(Z.Z,{children:(0,a.jsxs)(l.ZP,{container:!0,spacing:6,children:[(0,a.jsx)(l.ZP,{item:!0,xs:12,children:(0,a.jsx)(s.Z,{children:(0,a.jsx)(c.Z,{title:"Condiciones de Pago",action:(0,a.jsx)(v.Z,{options:[{text:"Importar",icon:(0,a.jsx)(x.Z,{icon:"tabler:file-import",fontSize:20})},{text:"Exportar",icon:(0,a.jsx)(x.Z,{icon:"clarity:export-line",fontSize:20})}],iconButtonProps:{size:"small",sx:{color:"text.primary"}}})})})}),(0,a.jsx)(l.ZP,{item:!0,xs:12,children:(0,a.jsxs)(s.Z,{children:[(0,a.jsx)(g.Z,{value:r,selectedRows:u,handleFilter:R,placeholder:"Nombre o c\xf3digo"}),(0,a.jsx)(p._,{autoHeight:!0,pagination:!0,rows:P.data,columns:_,disableRowSelectionOnClick:!0,paginationModel:y,onPaginationModelChange:N,onRowSelectionModelChange:e=>b(e),getRowId:e=>e.codigo,paginationMode:"server",loading:P.isLoading,rowCount:P.totalResults})]})})]})})};t.default=y},63676:function(e,t,r){"use strict";var a=r(85893),n=r(41664),i=r.n(n),o=r(87357),l=r(83321),s=r(50135);let d=e=>{let{value:t,selectedRows:r,handleFilter:n}=e;return(0,a.jsxs)(o.Z,{sx:{p:5,pb:3,width:"100%",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"},children:[(0,a.jsx)("div",{}),(0,a.jsxs)(o.Z,{sx:{display:"flex",flexWrap:"wrap",alignItems:"center"},children:[(0,a.jsx)(s.Z,{size:"small",value:t,sx:{mr:4,mb:2},placeholder:e.placeholder,onChange:e=>n(e.target.value)}),(0,a.jsx)(l.Z,{sx:{mb:2},disabled:!0,component:i(),variant:"contained",href:"/apps/invoice/add",children:"Crear Producto"})]})]})};t.Z=d},459:function(){}},function(e){e.O(0,[135,657,519,863,506,774,888,179],function(){return e(e.s=12785)}),_N_E=e.O()}]);