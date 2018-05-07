import * as d3 from 'd3';
import * as React from 'react';
import { Component } from 'react';
import { IData } from "../testData/leMis";

interface IProps {
  width: number;
  height: number;
  data: IData;
}

interface IRefs {
  mountPoint?: HTMLDivElement | null;
}

export default class ForceGraph extends Component<IProps, {}> {
  private ctrls: IRefs = {};
  private force: any;


  public componentDidMount() {
    const { width, height, data } = this.props;

    if (this.ctrls.mountPoint !== undefined) {

      this.force = d3
        .forceSimulation()
        .nodes(data.nodes)
        .force('charge', d3.forceManyBody().strength(-1800))
        .force("link", d3.forceLink(data.links).id((d: any) => d.id))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const svg = d3
        .select(this.ctrls.mountPoint)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const link = svg
        .append("g")
        .attr("class", "links")
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .style('stroke', '#999999')
        .style('stroke-opacity', 0.6)
        .style('stroke-width', d => Math.sqrt(d.value) * 2);


      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const node = svg
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append<SVGCircleElement>('circle')
        .attr('r', 40)
        .style('stroke', '#FFFFFF')
        .style('stroke-width', 2)
        .style('fill', (d: any) => color(d.group))
        .call(
          d3
            .drag()
            .on('start', ((d: any) => this.dragStarted(d, this.force)))
            .on('drag', this.dragged)
            .on('end', ((d: any) => this.dragEnded(d, this.force))),
      );

      const labels = svg.selectAll(".mytext")
						.data(data.nodes)
						.enter()
						.append("text")
					    .text((d: any) => d.id )
					    .style("text-anchor", "middle")
					    .style("fill", "white")
					    .style("font-family", "Arial")
					    .style("font-size", 12);


      this.force.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

        labels
          .attr("x", (d: any) => d.x )
          .attr("y", (d: any) => d.y);
      });
    }
  }

  

  public render() {
    const { width, height } = this.props;
    const style = {
      backgroundColor: '#333',
      height,
      width
    };
    return <div style={style} ref={mountPoint => (this.ctrls.mountPoint = mountPoint)} />;
  }

  private dragStarted(d: any, force: any) {
    if (!d3.event.active) {
      force.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  private dragged(d: any) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  private dragEnded(d: any, force: any) {
    if (!d3.event.active) { force.alphaTarget(0)};
    d.fx = null;
    d.fy = null;
  }

}
