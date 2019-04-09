import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Store from '../../reducers/context';
import dateFns from 'date-fns';
import * as action from '../../actions/todoActions';
import './index.scss';

const DatePicker = ({}) => {
  const dispatch = useContext(Store);
  const [currentMonth, setcurrentMonth] = useState(new Date());
  const [selectedDate, setselectedDate] = useState(new Date());
  const renderHeader = () => {
    const dateFormat = 'MMMM YYYY';
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'dddd';
    const days = [];
    let startDate = dateFns.startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat).substring(0, 3)}
        </div>,
      );
    }
    return <div className="days row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = 'D';
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? 'disabled'
                : dateFns.isSameDay(day, selectedDate)
                ? 'selected'
                : ''
            }`}
            key={day}
            onClick={() => onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
          </div>,
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  const onDateClick = (day) => {
    setselectedDate(day);
  };

  const nextMonth = () => {
    setcurrentMonth(dateFns.addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setcurrentMonth(dateFns.subMonths(currentMonth, 1));
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

DatePicker.propTypes = {
  isOpen: PropTypes.bool,
  switchHandler: PropTypes.func,
  currentTask: PropTypes.func,
};

DatePicker.defaultProps = {
  isOpen: false,
  switchHandler: null,
  currentTask: null,
};
export default DatePicker;