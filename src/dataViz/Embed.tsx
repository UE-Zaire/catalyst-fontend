/* tslint:disable:no-console jsx-no-lambda */
import * as d3 from 'd3';
import * as React from 'react';
import { Component } from 'react';


interface IProps {
  width: number;
  height: number;
  data: any;
  labels: Array<{id: string, label: string}>;
}

interface IRefs {
  mountPoint?: HTMLDivElement | null;
}

let idleTimeout: any;

export default class Embed extends Component<IProps> {

  private ctrls: IRefs = {};

  public componentDidMount() {
    this.renderEmbed();
  }

  public render() {
    const { width, height } = this.props;
    const style = {
      backgroundColor: '#333',
      height, 
      width
    };

    return (
      <div>
        <div style={style} ref={mountPoint => (this.ctrls.mountPoint = mountPoint)}/>
      </div>
    );
  }

  private renderEmbed = () => {
    const { width, height } = this.props;

    const data = this.props.data.map((point: number[], idx: number) => {
      const newD: any = point.slice()
      newD.push(this.props.labels[idx].id);
      return newD;
    });

    console.log('sample data', this.props.data, 'labels ', this.props.labels)

    const xCoords: number[] = data.map((point: number[]) => point[0]);

    const yCoords: number[] = data.map((point: number[]) => point[1]);

    if (this.ctrls.mountPoint !== undefined) {

      
      const x0 = [Math.min(...xCoords), Math.max(...xCoords)];
      const  y0 = [Math.min(...yCoords), Math.max(...yCoords)];
      const x = d3.scaleLinear().domain(x0).range([0, width]);
      const y = d3.scaleLinear().domain(y0).range([height, 0]);
      const z = d3.scaleOrdinal(d3.schemeCategory10);
      
      const svg = d3
        .select(this.ctrls.mountPoint)  
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 8 + "," + 8 + ")");

      // const clip = svg.append("defs").append("svg:clipPath")
      // .attr("id", "clip")
      // .append("svg:rect")
      // .attr("width", width)
      // .attr("height", height)
      // .attr("x", 0)
      // .attr("y", 0);

      // const xExtent = d3.extent(data, (d: any) => {
      //   return d.x;
      // });
      // const yExtent = d3.extent(data, (d: any) => {
      //   return d.y;
      // });
      // x.domain(d3.extent(data, (d) => d.x)).nice();
      // y.domain(d3.extent(data, function(d) {
      //   return d.y;
      // })).nice();
      

      // console.log('x is in d3 render', x);

      const xAxis = d3.axisTop(x).ticks(12);
      const yAxis = d3.axisRight(y).ticks(12 * height / width);

      console.log('this in d3 render', this);

      const idleDelay = 350;
      const brush = d3.brush().on("end", () => this.brushended(brush, idleDelay, x, x0, xAxis, y, y0, yAxis, svg));
      svg.append("g")
        .attr("class", "brush")
        .call(brush);

      svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("cx", (d: any) => x(d[0]))
        .attr("cy", (d: any) => y(d[1]))
        .attr("r", data.length / 100)
        .attr("fill", (d: any) => z(d[2]))
        .on("click", (d: any) => this.poop(d));

      // svg.selectAll("circle")
      //   .data(data)
      //   .enter().append("circle")
      //   .attr("cx", (d: any) => x(d[0]))
      //   .attr("cy", (d: any) => y(d[1]))
      //   .attr("r", data.length / 100)
      //   .attr("fill", (d: any) => z(d[2]))
      //   .on("click", (d: any) => this.poop(d));


      svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height - 10) + ")")
        .call(xAxis);

      svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(10,0)")
        .call(yAxis);

      svg.selectAll(".domain")
        .style("display", "none");


    }

    
  }

  private brushended = (brush: any, idleDelay: any, x: any, x0: any, xAxis: any, y: any, y0: any, yAxis: any, svg: any) => {

    const s = d3.event.selection;
    if (!s) {
      if (!idleTimeout) {
        idleTimeout = setTimeout(() => this.idled(), idleDelay)
        return idleTimeout;
      }
      x.domain(x0);
      y.domain(y0);
    } else {
      x.domain([s[0][0], s[1][0]].map(x.invert, x));
      y.domain([s[1][1], s[0][1]].map(y.invert, y));
      svg.select(".brush").call(brush.move, null);
    }
    this.zoom(svg, x, xAxis, y, yAxis);
  }
  
  private idled() {
    console.log('calling idled', idleTimeout)
    idleTimeout = null;
  }
  
  private zoom(svg: any, x: any, xAxis: any, y: any, yAxis: any) {

    const t = svg.transition().duration(750);
    svg.select(".axis--x").transition(t).call(xAxis);
    svg.select(".axis--y").transition(t).call(yAxis);
    svg.selectAll("circle").transition(t)
        .attr("cx", (d: any) => x(d[0]))
        .attr("cy", (d: any) => y(d[1]));
  }

  private poop = (d: any) => {
    alert(`${d}`);
  }

}