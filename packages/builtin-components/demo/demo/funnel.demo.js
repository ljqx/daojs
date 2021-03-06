import React from 'react';
import echarts from 'echarts';
import builtinComponents from '../../src/index';
import daoTheme1 from '../assets/DaoTheme1.json';

echarts.registerTheme('theme1', daoTheme1);

const {
  Funnel,
} = builtinComponents;

const data = [
  ['name', 'value'],
  ['访问', 60],
  ['咨询', 40],
  ['订单', 20],
  ['点击', 80],
  ['展现', 110],
];

export default function FunnelDemo() {
  return (
    <Funnel source={data} />
  );
}
