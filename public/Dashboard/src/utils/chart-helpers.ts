
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

/**
 * Safely format a value from recharts that could be a string, number, or array
 */
export const formatChartValue = (value: ValueType, decimals: number = 1): string => {
  if (typeof value === 'number') {
    return value.toFixed(decimals);
  }
  
  if (Array.isArray(value) && typeof value[0] === 'number') {
    return value[0].toFixed(decimals);
  }
  
  return String(value);
};
