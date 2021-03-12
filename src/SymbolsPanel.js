import API_RAW from "filament-lang/src/api.json.js"
import {useState} from 'react'
import "./symbolspanel.css"

const API = JSON.parse(API_RAW)
function Constant({symbol}) {
    return <li><i>const</i> <b>{symbol.name}</b></li>
}

function search_doc(name) {
    for(let group of Object.values(API)) {
        for( let doc of group) {
            if(doc.name === name) {
                return doc
            }
        }
    }
    return null
}

function FunctionSymbol({symbol}) {
    let [open, setOpen] = useState(false)

    let rendered_doc = ""
    let doc = search_doc(symbol.name)
    if(doc) {
        console.log("matched a doc",doc)
        let parms = Object.entries(doc.params).map(([name, val]) => {
            return <li>{name}:{val}</li>
        })
        rendered_doc = <div className={'accordion-content'}>
            <p className={'summary'}><b>function</b> {doc.summary}</p>
            <ul className={'parameters'}>{parms}</ul>
            {doc.examples.map(ex => {
                return <blockquote className={'example'}>{ex.toString().trim()}</blockquote>
            })}
        </div>
    } else {
        let parms = Object.entries(symbol.params).map(([name, val]) => {
            return <li>{name}</li>
        })
        rendered_doc = <div className={'accordion-content'}>
            <i>fun</i>&nbsp;
            <b>{symbol.name}(</b>
            <p className={'summary'}>{symbol.summary}</p>
            <ul className={'parameters'}>{parms}</ul>
            <b>)</b>
        </div>
    }
    return <li className={'accordion-item ' + (open?"opened":"closed")}>
        <h3 className={'accordion-button'} onClick={()=>setOpen(!open)}>{symbol.name}</h3>
        {rendered_doc}
    </li>
}

export function SymbolsPanel({scope}) {
    let names = scope.names().slice()
    names.sort()
    return <ul className={'symbols'}>
        {names.map((name) => {
            let fun = scope.funs[name]
            if(fun.type === 'scalar') return <Constant key={name} symbol={fun}/>
            // console.log('symbol is',fun.type)
            return <FunctionSymbol key={name} symbol={fun}/>
        })}
    </ul>
}