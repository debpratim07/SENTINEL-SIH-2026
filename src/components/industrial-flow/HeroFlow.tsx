import { Artwork, cx, type IllustrationProps, type CSSVars } from './shared';
import { FlowNode } from './FlowNode';
import { FlowPath } from './FlowPath';
import { FlowPulse } from './FlowPulse';
import { FlowJunction } from './FlowJunction';
const routes = [
 'M72 200H142Q158 200 158 184V136Q158 120 174 120H234',
 'M266 120H318Q334 120 334 136V184Q334 200 350 200H386',
 'M410 200H458Q474 200 474 216V264Q474 280 490 280H546',
 'M578 280H610Q626 280 626 264V216Q626 200 642 200H666',
];
export function HeroFlow({ animated = true, className, ...props }: IllustrationProps) {
 return <Artwork {...props} viewBox="0 0 720 400" className={cx('if-hero', className)} data-animate={animated}>
  <g className="if-desktop-art">
   <g className="if-technical" opacity=".6">
    <path d="M32 72h24m-12-12v24M664 328h24m-12-12v24M44 316v12h12M676 84V72h-12"/>
    <rect x="196" y="66" width="108" height="108" rx="24"/>
    <rect x="510" y="230" width="104" height="100" rx="24"/>
    <path d="M86 200H110V318H342M250 174v144M398 98v42M562 72v158" strokeDasharray="2 7"/>
   </g>
   <g className="if-ambient" opacity=".55"><circle cx="398" cy="200" r="42" className="if-technical"/><circle cx="398" cy="200" r="58" className="if-technical" strokeDasharray="2 9"/></g>
   <FlowPath d="M72 200H124Q140 200 140 216V264Q140 280 156 280H302Q318 280 318 264V216Q318 200 334 200H386"/>
   <FlowPath d="M410 200H450Q466 200 466 184V136Q466 120 482 120H578Q594 120 594 136V184Q594 200 610 200H666"/>
   {routes.map((d,i)=><g key={d}><FlowPath d={d} state="flowing"/><FlowPulse d={d} animated={animated} delay={i*360} duration={480}/></g>)}
   <FlowJunction x={140} y={200}/><FlowJunction x={318} y={280}/><FlowJunction x={594} y={200}/>
   <g className="if-technical"><path d="M230 100l40 40M230 140l40-40"/><rect x="228" y="98" width="44" height="44" rx="12" stroke="var(--if-accent)" fill="var(--if-accent-soft)"/></g>
   <FlowNode x={72} y={200} radius={14} state="active" className="if-hero-node" style={{'--if-delay':'0ms'} as CSSVars}/>
   <FlowNode x={250} y={120} radius={15} shape="square" state="active" className="if-hero-node" style={{'--if-delay':'360ms'} as CSSVars}/>
   <FlowNode x={398} y={200} radius={14} state="active" className="if-hero-node" style={{'--if-delay':'720ms'} as CSSVars}/>
   <g className="if-hero-node" style={{'--if-delay':'1080ms'} as CSSVars} stroke="var(--if-accent)" fill="var(--if-accent-soft)" strokeWidth="2"><rect className="if-node-shell" x="540" y="258" width="44" height="44" rx="12"/><path d="M550 272h24m-24 8h24m-24 8h24"/><circle cx="558" cy="272" r="3" fill="var(--if-surface)"/><circle cx="568" cy="288" r="3" fill="var(--if-surface)"/></g>
   <FlowNode x={678} y={200} radius={14} shape="square" state="active" className="if-hero-node" style={{'--if-delay':'1440ms'} as CSSVars}/>
   <FlowNode x={206} y={280} radius={7}/><FlowNode x={530} y={120} radius={7}/>
   <g className="if-technical"><path d="M38 200h12M72 166v12M72 222v12M678 166v12M678 222v12M700 200h10"/></g>
  </g>
  <g className="if-mobile-art" transform="translate(40 25)">
   <path className="if-technical" d="M42 70h556M42 280h556" strokeDasharray="2 10"/>
   <FlowPath d="M64 170H198Q214 170 214 154V116Q214 100 230 100H302Q318 100 318 116V224Q318 240 334 240H410Q426 240 426 224V186Q426 170 442 170H576" state="flowing"/>
   <FlowPulse d="M64 170H198Q214 170 214 154V116Q214 100 230 100H302Q318 100 318 116V224Q318 240 334 240H410Q426 240 426 224V186Q426 170 442 170H576" duration={1440} animated={animated}/>
   {[[64,170],[264,100],[372,240],[576,170]].map(([x,y],i)=><FlowNode key={i} x={x} y={y} radius={17} shape={i%2 ? 'square':'circle'} state="active" className="if-hero-node" style={{'--if-delay':`${i*360}ms`} as CSSVars}/>)}
  </g>
 </Artwork>;
}
