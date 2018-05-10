/* tslint:disable:no-console jsx-no-lambda */
import * as d3 from 'd3';
import * as React from 'react';
import { Component } from 'react';


interface IProps {
  width: number;
  height: number;
  data: any;
}

interface IRefs {
  mountPoint?: HTMLDivElement | null;
}

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
    const { width, height, data } = this.props;

    const xCoords: number[] = data.map((point: number[]) => point[0]);

    const yCoords: number[] = data.map((point: number[]) => point[1]);

    if (this.ctrls.mountPoint !== undefined) {
      const svg = d3
        .select(this.ctrls.mountPoint)  
        .append("svg")
        .attr("width", width)
        .attr("height", height)

      const x0 = [Math.min(...xCoords), Math.max(...xCoords)];
      const  y0 = [Math.min(...yCoords), Math.max(...yCoords)];
      const x = d3.scaleLinear().domain(x0).range([0, width]);
      const y = d3.scaleLinear().domain(y0).range([height, 0]);
      const z = d3.scaleOrdinal(d3.schemeCategory10);

      console.log('x is in d3 render', x);

      const xAxis = d3.axisTop(x).ticks(12);
      const yAxis = d3.axisRight(y).ticks(12 * height / width);

      console.log('this in d3 render', this);

      const idleTimeout = null;
      const idleDelay = 350;
      const brush = d3.brush().on("end", () => this.brushended(brush, idleDelay, idleTimeout, this.idled, x, x0, xAxis, y, y0, yAxis, svg, this.zoom));

      svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", (d: any) => x(d[0]))
        .attr("cy", (d: any) => y(d[1]))
        .attr("r", 2.5)
        .attr("fill", (d: any) => z(d[2]));

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

      svg.append("g")
        .attr("class", "brush")
        .call(brush);

    }
  }

  private brushended = (brush: any, idleDelay: any, idleTimeout: any, idled: any, x: any, x0: any, xAxis: any, y: any, y0: any, yAxis: any, svg: any, zoom: any) => {

    const s = d3.event.selection;
    if (!s) {
      if (!idleTimeout) {
        idleTimeout = setTimeout(() => idled(idleTimeout), idleDelay)
        return idleTimeout;
      }
      x.domain(x0);
      y.domain(y0);
    } else {
      x.domain([s[0][0], s[1][0]].map(x.invert, x));
      y.domain([s[1][1], s[0][1]].map(y.invert, y));
      svg.select(".brush").call(brush.move, null);
    }
    zoom(svg, x, xAxis, y, yAxis);
  }
  
  private idled(idleTimeout: any) {
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

}