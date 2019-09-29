import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import * as d3 from 'd3'
import { FONT_FAMILY } from 'ui/theme'
const ROW_HEIGHT = 20

export default props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const d3Container = useRef(null)

  const drawChart = res => {
    const { columns, data } = res
    if (dimensions.width === 0) {
      return
    }

    const margin = { top: 110, right: 15, bottom: 20, left: 50 }
    const width = dimensions.width
    const height = data.length * ROW_HEIGHT + margin.top + margin.bottom

    const labels = ['建制', '其他', '非建制']
    const series = d3
      .stack()
      .keys(columns.slice(1))
      .offset(d3.stackOffsetExpand)(data)

    series.forEach((s, index) => {
      s.forEach((d, y) => {
        d.count = data[y][labels[index]]
        d.index = index
      })
    })

    const yAxis = g =>
      g
        .style('font', `12px ${FONT_FAMILY}`)
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll('.domain').remove())

    const xAxis = g =>
      g
        .style('font', `12px ${FONT_FAMILY}`)
        .attr('transform', `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 100, '%'))
        .call(g => g.selectAll('.domain').remove())

    const color = d3
      .scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(['#ff6779', '#eeeeee', '#00c376'])
      .unknown('#ccc')

    const y = d3
      .scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1)

    const x = d3.scaleLinear().range([margin.left, width - margin.right])

    const isCreate = d3
      .select(d3Container.current)
      .select('svg')
      .empty()

    // d3.select(d3Container.current)
    //   .select('svg')
    //   .remove()

    if (isCreate) {
      const svg = d3
        .select(d3Container.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      const bar = svg
        .append('g')
        .selectAll('g')
        .data(series)
        .enter()
        .append('g')

      bar
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => (d.index === 0 ? x(d[0]) : x(d[1])))
        .attr('y', (d, i) => y(d.data.name))
        .attr('width', 0)
        .attr('height', y.bandwidth())

      bar
        .selectAll('rect')
        .transition()
        .delay(function(d) {
          return Math.random() * 1000
        })
        .duration(1000)
        .attr('x', d => x(d[0]))
        .attr('width', d => x(d[1]) - x(d[0]))

      bar
        .selectAll('text')
        .data(d => d)
        .join('text')
        .text(function(d, i, groups, f) {
          return d.count === 0 ? '' : d.count + '席'
        })
        .attr('x', d => {
          switch (d.index) {
            case 0:
              return x(d[0]) + 8
            case 2:
              return x(d[1]) - 8
            default:
              return x(d[0]) + (x(d[1]) - x(d[0])) / 2
          }
        })
        .attr('y', (d, i) => y(d.data.name) + y.bandwidth() / 2)
        .attr('alignment-baseline', 'central')
        .attr('text-anchor', d => {
          switch (d.index) {
            case 0:
              return 'start'
            case 2:
              return 'end'
            default:
              return 'middle'
          }
        })

        .attr('font-family', 'sans-serif')
        .attr('font-size', '12px')
        .attr('fill', d => {
          switch (d.index) {
            case 0:
            case 2:
              return 'white'
            default:
              return 'black'
          }
        })

      svg.append('g').call(xAxis)
      svg.append('g').call(yAxis)

      // middle line
      const middle = (width + margin.left - margin.right) / 2
      svg
        .append('line')
        .attr('x1', middle + 1)
        .attr('y1', margin.top)
        .attr('x2', middle + 1)
        .attr('y2', height - margin.bottom)
        .attr('stroke-width', 1)
        .attr('stroke', '#3a3a3a')
        .attr('opacity', '0.6')
        .style('stroke-dasharray', '10, 4')

      //Legend
      const legend = svg
        .selectAll('.legend')
        .data(labels)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(0, ${10 + i * 23})`)

      legend
        .append('rect')
        .attr('x', width - margin.right - 50)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', function(d) {
          return color(d)
        })

      legend
        .append('text')
        .attr('x', width - margin.right - 20)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'start')
        .text(function(d) {
          return d
        })
    } else {
      // Update chart
      const svg = d3.select(d3Container.current).select('svg')

      const bar = svg
        .select('g')
        .selectAll('g')
        .data(series)

      bar
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .transition()
        .delay(function(d) {
          return Math.random() * 1000
        })
        .duration(1000)
        .attr('x', d => {
          return x(d[0])
        })
        .attr('y', (d, i) => y(d.data.name))
        .attr('width', d => x(d[1]) - x(d[0]))
        .attr('height', y.bandwidth())

      bar
        .selectAll('text')
        .data(d => d)
        .join('text')
        .text(function(d, i, groups, f) {
          return d.count === 0 ? '' : d.count + '席'
        })
        .attr('opacity', 0)
        .attr('x', d => {
          switch (d.index) {
            case 0:
              return x(d[0]) + 8
            case 2:
              return x(d[1]) - 8
            default:
              return x(d[0]) + (x(d[1]) - x(d[0])) / 2
          }
        })
        .attr('y', (d, i) => y(d.data.name) + y.bandwidth() / 2)
        .attr('alignment-baseline', 'central')
        .attr('text-anchor', d => {
          switch (d.index) {
            case 0:
              return 'start'
            case 2:
              return 'end'
            default:
              return 'middle'
          }
        })
      bar
        .selectAll('text')
        .transition()
        .delay(function(d) {
          return 800 + Math.random() * 500
        })
        .attr('opacity', 1)
    }
  }

  const updateWindowSize = () => {
    if (d3Container.current) {
      setDimensions({
        width: d3Container.current.clientWidth,
      })
    }
  }

  useEffect(() => {
    window.addEventListener('resize', updateWindowSize)
    drawChart(props.data)
  })

  useLayoutEffect(() => {
    updateWindowSize()
  }, [])

  return (
    <>
      <div ref={d3Container} style={{ height: 'auto', width: '100%' }}></div>
    </>
  )
}
