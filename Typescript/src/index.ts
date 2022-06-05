type Size = "small" | "big";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type Day = typeof DAYS[number];

interface OrderDetails {
  size: Size;
  date: Date;
  isAm?: boolean;
  customFrosting?: boolean;
  fancyBox?: boolean;
  hasNuts?: boolean;
}

export const toDayOfWeek = (date: Date): Day => DAYS[date.getDay()];

const advanceDays = (days: number) => (date: Date) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

const toTomorrow = advanceDays(1);
const toYesterday = advanceDays(-1);

const isShopClosed = (date: Date) =>
  (date.getMonth() === 11 && date.getDate() >= 23) ||
  (date.getMonth() === 0 && date.getDate() < 2);

const nextOpenDate = (date: Date) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1, 0, 2);
  return newDate;
};

const work =
  (workingDays: Day[]) => (startDate: Date, requiredDays: number) => {
    let workingDate = new Date(startDate);
    let workedDays = 0;
    while (workedDays < requiredDays) {
      const canWork = workingDays.indexOf(toDayOfWeek(workingDate)) !== -1;
      if (canWork) {
        workedDays++;
      }
      workingDate = toTomorrow(workingDate);
    }

    // we've advanced the working date by one extra, remove it now
    return toYesterday(workingDate);
  };

const marcoWork = work([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
]);

const sandroWork = work([
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

const bake = (startDate: Date, orderDetails: OrderDetails) => {
  const daysRequired = orderDetails.size === "small" ? 2 : 3;
  const workFrom = orderDetails.isAm
    ? new Date(startDate)
    : toTomorrow(startDate);
  return marcoWork(workFrom, daysRequired);
};

const frost = (startDate: Date, orderDetails: OrderDetails) => {
  if (!orderDetails.customFrosting) {
    return startDate;
  }
  const workFrom = toTomorrow(startDate);
  return sandroWork(workFrom, 2);
};

const nutify = (startDate: Date, orderDetails: OrderDetails) => {
  if (!orderDetails.hasNuts) {
    return startDate;
  }
  const workFrom = toTomorrow(startDate);
  return marcoWork(workFrom, 1);
};

const box = (startDate: Date, orderDetails: OrderDetails) => {
  if (!orderDetails.fancyBox) {
    return startDate;
  }

  const boxArrival = advanceDays(2)(orderDetails.date);
  return boxArrival > startDate ? boxArrival : startDate;
};

const createCake = (startDate: Date, details: OrderDetails) => {
  return [bake, frost, nutify, box].reduce(
    (currentDate, fn) => fn(currentDate, details),
    startDate
  );
};

export function order(orderDetails: OrderDetails) {
  const finishDate = createCake(orderDetails.date, orderDetails);
  if (isShopClosed(finishDate)) {
    const newStartDate = nextOpenDate(orderDetails.date);
    // create the new cake, but we can start from the morning now regardless
    return createCake(newStartDate, { ...orderDetails, isAm: true });
  }

  return finishDate;
}
