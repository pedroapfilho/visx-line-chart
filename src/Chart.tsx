import { useMemo, TouchEvent, MouseEvent } from "react";
import { Bar, LinePath } from "@visx/shape";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { scaleLinear, scaleTime } from "@visx/scale";
import { localPoint } from "@visx/event";
import { TooltipWithBounds, useTooltip, defaultStyles } from "@visx/tooltip";
import useMeasure from "react-use-measure";
import styled from "styled-components";
import { timeFormat } from "d3-time-format";
import { Group } from "@visx/group";
import { bisector, extent } from "d3-array";

const data = appleStock.slice(0, 100);

const getYValue = (d: AppleStock) => d.close;

const getXValue = (d: AppleStock) => new Date(d.date);

const bisectDate = bisector<AppleStock, Date>((d) => new Date(d.date)).left;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  position: relative;
  width: 600px;
  height: 400px;
`;

const StyledSVG = styled.svg`
  overflow: visible;
`;

const tooltipStyles = {
  ...defaultStyles,
  borderRadius: 4,
  background: "black",
  color: "white",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const Chart = () => {
  const [ref, { width, height }] = useMeasure();

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<AppleStock>();

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, width],
        domain: extent(data, getXValue) as [Date, Date],
      }),
    [width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [
          Math.min(...data.map(getYValue)) - 1,
          Math.max(...data.map(getYValue)),
        ],
      }),
    [height]
  );

  return (
    <Wrapper>
      <Container ref={ref}>
        <StyledSVG width={width} height={height} ref={ref}>
          <Group>
            <LinePath<AppleStock>
              data={data}
              x={(d) => xScale(getXValue(d)) ?? 0}
              y={(d) => yScale(getYValue(d)) ?? 0}
              strokeWidth={2}
              stroke="black"
            />
          </Group>

          <Group>
            <Bar
              x={0}
              y={0}
              width={width}
              height={height}
              fill="transparent"
              onMouseMove={(
                event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>
              ) => {
                const { x } = localPoint(event) || { x: 0 };
                const x0 = xScale.invert(x);
                const index = bisectDate(data, x0, 1);
                const d0 = data[index - 1];
                const d1 = data[index];
                let d = d0;
                if (d1 && getXValue(d1)) {
                  d =
                    x0.valueOf() - getXValue(d0).valueOf() >
                    getXValue(d1).valueOf() - x0.valueOf()
                      ? d1
                      : d0;
                }
                showTooltip({
                  tooltipData: d,
                  tooltipLeft: xScale(getXValue(d)),
                  tooltipTop: yScale(getYValue(d)),
                });
              }}
              onMouseLeave={() => hideTooltip()}
            />
          </Group>

          {tooltipData ? (
            <Group>
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill="orange"
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </Group>
          ) : null}
        </StyledSVG>

        {tooltipData ? (
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <b>{`${timeFormat("%b %d, %Y")(
              new Date(getXValue(tooltipData))
            )}`}</b>
            : ${getYValue(tooltipData)}
          </TooltipWithBounds>
        ) : null}
      </Container>
    </Wrapper>
  );
};

export default Chart;
