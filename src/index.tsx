import React, { useState } from 'react';
import { initializeWidget,useRecords, useActiveCell, useRecord, useSelection, useActiveViewId,FieldPicker,useCloudStorage,CellValue,useViewport,useField } from '@vikadata/widget-sdk';

// 使用一个对象管理 CSS 
let indexStyle = {
  expandView: {
    display: "flex", 
    flexDirection:"column",
    padding:16,
    margin:"0 auto",
    maxWidth:320
  },

  list:{
    padding:0,
    margin:0,
    display: "flex", 
    flexDirection:"column",
    gap:16
  },

  select:{
    padding:0,
    margin:0,
    display: 'flex', 
    flexDirection:"column",
    gap:8,
  },

  valueContent : {
    display: 'flex', 
    flexDirection:"column",
    gap:4,
    padding:8,
    border: "1px solid #E8EAED",
    borderRadius:4
  },

  fieldName : {
    margin:0,
    color:"#999"
  }
}



// 通过 cellvalue 组件显示值，如果没有选择字段，则不渲染该组件，以免报错
const ShowCellValue : React.FC = (props) =>{
  const reId = props.theRecordId
  const fieId = props.theFieldId
  
  if(!reId){
    return <p style={{margin:0}}>-</p>
  }else{   
      return (
        <div>
            <CellValue recordId={reId} fieldId = {fieId} />
        </div>
      ) 
  }
}

// 选择字段的组件
export const FieldSelect:React.FC =(props)=>{
  const selection = useSelection();
  const viewId = useActiveViewId();
  const activeCell = useActiveCell();
  const records = activeCell?.recordId;

 // 定义一个 key 序列 props 保证每个组件实例有独立的 fieldId
  let key = props.index
  const [fieldId, setFieldId] = useCloudStorage(key,'')

  // 接入判断是否全屏
  const { isFullscreen } = useViewport();

  // 定义一个 字段名 变量
  let fieldName = useField(fieldId);
  let fieldNameValue 

  // 当 useField 数据类型不是 对象时，说明没有选择字段，显示 - 
  if (typeof(fieldName) !== "object") {
    fieldNameValue = "-"
  } else{
    fieldNameValue = fieldName.name
  }
  

  return (
    <div style={indexStyle.select}>
    {/* 全屏时才显示字段选择器 */}
      {isFullscreen ? 
        <FieldPicker   viewId={viewId} fieldId={fieldId} onChange={option => setFieldId(option.value)}/> 
      : "" }
    {/* 全屏时不显示字段值 */}
      {isFullscreen ? "" :
        <div style={indexStyle.valueContent} >
          <p style={indexStyle.fieldName}>{fieldNameValue}</p>
          <ShowCellValue theRecordId={records} theFieldId = {fieldId}/>
        </div>
      }
    </div>
  )
}


// 最外层组件 
export const ExpandView: React.FC = () => {

  const i = [0,1,2,3,4,5,6,7]


  const { isFullscreen } = useViewport();



  return (
    <div  style={indexStyle.expandView}>
      {/* 标题在全屏下的切换 */}
     <h4 style={{marginBottom:16}}> {isFullscreen ? "选择要查看的字段" : "扩展查看"}</h4>
     {/* 字段选择列表 */}
       <ul style={indexStyle.list}>
        <FieldSelect index={i[0]}/>
        <FieldSelect index={i[1]}/>
        <FieldSelect index={i[2]}/>
        <FieldSelect index={i[3]}/>
        <FieldSelect index={i[4]}/>
      </ul>
    </div>
  );
};

initializeWidget(ExpandView, process.env.WIDGET_PACKAGE_ID);
