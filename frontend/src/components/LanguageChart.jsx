import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FiPieChart } from 'react-icons/fi';

// Curated color palette for language slices
const COLORS = [
  '#58A6FF', // blue (primary)
  '#3FB950', // green
  '#BC8CFF', // purple
  '#F78166', // orange-red
  '#FFD700', // gold
  '#56D364', // light green
  '#79C0FF', // light blue
  '#D29922', // yellow
  '#FF7A7A', // red
  '#A8B3C9', // grey
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="glass rounded-lg p-3 shadow-xl border border-github-border">
        <p className="font-semibold text-github-text">{item.name}</p>
        <p className="text-github-muted text-sm">
          {item.payload.value} repos ({item.payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
  if (percentage < 8) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${percentage}%`}
    </text>
  );
};

const LanguageChart = ({ languageBreakdown }) => {
  if (!languageBreakdown || languageBreakdown.length === 0) return null;

  // Merge small slices into "Other"
  const sorted = [...languageBreakdown].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 8);
  const rest = sorted.slice(8);
  const chartData = rest.length > 0
    ? [...top, { name: 'Other', value: rest.reduce((s, r) => s + r.value, 0), percentage: rest.reduce((s, r) => s + r.percentage, 0) }]
    : top;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card p-6"
      id="language-chart"
    >
      <h3 className="section-title">
        <FiPieChart className="text-github-primary" />
        Language Analytics
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={50}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={10}
            formatter={(value) => (
              <span className="text-github-muted text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default LanguageChart;
