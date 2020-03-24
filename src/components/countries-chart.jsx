import React, { useMemo } from 'react';
import { screenFormat, w, h, PORTRAIT, LANDSCAPE, SQUARED } from '../util/screen';
import { ResponsiveLine } from '@nivo/line';

function CountriesChart({
  data,
  yLegend,
  maxItemsX = 10,
  colors = { scheme: 'category10' },
}) {


  const xInterval = Math.ceil(data[0].data.length / maxItemsX);

  const factor = useMemo(() => {

    let result;

    switch (screenFormat) {
      case PORTRAIT:
        result = w / 720;
        break;
      case LANDSCAPE:
      case SQUARED:
        result = h / 720;
        break;
      default:
        result = Math.min(w, h) / 720;
    }

    return result;
  }, [screenFormat, w, h]);

  const theme = useMemo(() => {
    return {
      fontSize: `${9 * factor}px`,
      axis: {
        fontSize: `${9 * factor}px`,
        legend: {
          text: {
            fontSize: `${9 * factor}px`,
          }
        }
      },
    };
  }, [factor]);

  // return (
  //   <div className="countries-chart">ok</div>
  // );

  // if (!height) return null;

  return (
    <div className="countries-chart">
      <ResponsiveLine
        data={data}
        theme={theme}
        animate={true}
        // width={width - 20}
        // height={height - 20}
        margin={{ top: 50 * factor, right: 60 * factor, bottom: 54 * factor, left: 80 * factor }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        curve="monotoneX"
        // useMesh={true}
        lineWidth={6}
        // enablePointLabel={true}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          precision: 'day',
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: 'linear',
          stacked: true,
        }}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          legend: yLegend,
          legendOffset: -60 * factor,
          legendPosition: 'middle',
        }}
        axisBottom={{
          format: '%b %d',
          tickValues: `every ${xInterval} days`,
          tickRotation: 90,
          tickSize: 3 * factor,
          legend: 'time',
          legendOffset: 42 * factor,
          legendPosition: 'middle'
        }}
        colors={colors}
        pointColor={{ theme: 'background' }}
        pointBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]],
        }}
        layers={['axes', 'mesh', 'areas', 'grid', 'lines']}
      />
    </div>
  );

}

export default CountriesChart;