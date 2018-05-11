/* tslint:disable:no-console jsx-no-lambda */
import { Button, Icon, Layout, Row, Select } from "antd";
import * as React from "react";
import * as Autocomplete from "react-autocomplete";
// import "../../node_modules/antd/es/dropdown/style/index.css";

const { Header } = Layout;
const { Option, OptGroup } = Select;

const headerStyle: object = {
  background: '#fff', 
  padding: 0
}

const rowStyle: object = {
  paddingBottom: 4,
  paddingTop: 4
}

const autoCompStyle: object = {
  display: 'inline-block',
  paddingLeft: 8, 
  paddingRight: 8, 
}

interface IHeadProps {
  collapsed: boolean;
  toggleSider: () => void;
  suggestions: object;
  input1: string;
  input2: string;
  ctrlInput: (e: any) => void;
  ctrlSelect1: (value: string ) => void;
  ctrlSelect2: (value: string ) => void;
  view: string;
  chgView: (e: any) => void;
  postPaths: () => void;
  postPath: () => void;
  postSurroundings: () => void;
}

const Head = (props: IHeadProps) => {
  
  const blockInputOverlap1 = (item: any) => item.label === props.input2 ? false : true;

  const blockInputOverlap2 = (item: any) => item.label === props.input1 ? false : true;
  
  return (
    <Header style={headerStyle}>
      <Row align="middle" gutter={16} style={rowStyle}>
        <Icon
          className="trigger"
          type={props.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={props.toggleSider}
          style={{ width: '6rem' }}
        />
        <Autocomplete
          items={props.suggestions}
          shouldItemRender={(item: any, value: any) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={(item: any) => item.label}
          renderItem={(item: any, isHighlighted: any) =>
            <div
              key={item.id}
              style={{ backgroundColor: isHighlighted ? '#eee' : 'transparent' }}
            >
              {item.label}
            </div>
          }
          renderInput={(inputProps: any) => (<input id="value1" className="ant-input" placeholder="Select a Topic" {...inputProps} />)}
          value={props.input1}
          onChange={props.ctrlInput}
          onSelect={props.ctrlSelect1}
          wrapperStyle={autoCompStyle}
          isItemSelectable={blockInputOverlap1}
          selectOnBlur={true}
        />
        {
          props.view === 'surroundings' ?
            (<Select
              defaultValue="1"
              style={{ width: 200 }}
              onChange={props.chgView}
            >
              <OptGroup label="Depth">
                <Option value="1">1</Option>
                <Option value="2">2</Option>
              </OptGroup>
            </Select>) :
            (<Autocomplete
              items={props.suggestions}
              shouldItemRender={(item: any, value: any) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
              getItemValue={(item: any) => item.label}
              renderItem={(item: any, isHighlighted: any) =>
                <div
                  className="ant-select-dropdown-menu-item"
                  key={item.id}
                  style={{ backgroundColor: isHighlighted ? '#eee' : 'transparent' }}
                >
                  {item.label}
                </div>
              }
              renderInput={(inputProps: any) => (<input id="value2" className="ant-input" placeholder="Select a Second Topic" {...inputProps} />)}
              value={props.input2}
              onChange={props.ctrlInput}
              onSelect={props.ctrlSelect2}
              wrapperStyle={autoCompStyle}
              isItemSelectable={blockInputOverlap2}
              selectOnBlur={true}
            />)
        }
        <Button
          onClick={
            props.view === 'paths' ?
              props.postPaths :
              props.view === 'path' ?
                props.postPath :
                props.postSurroundings
          }
          type={"primary"}
        >
          Submit
      </Button>
      </Row>
    </Header>
  );
}

export default Head;
