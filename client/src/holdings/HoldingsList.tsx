import './HoldingsList.css';

import React, {useEffect, useState} from 'react';

import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import ShowChartIcon from '@material-ui/icons/ShowChart';

import {API, Holding, Performance, Trade, User} from '../api';
import {AddHoldingForm} from './AddHoldingForm';
import {AddTradeDialog} from './AddTradeDialog';
import {PerformanceDisplay} from './PerformanceDisplay';
import {TradesList} from './TradesList';
import {formatValue} from './utils/display';
import {getTotalPerformance, setHoldingPerformance} from './utils/performance';

export type HoldingsListProps = {
  user: User;
};

/** Displays of all the user's holdings with the option to add more. */
export function HoldingsList({user}: HoldingsListProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [totalPerformance, setTotalPerformance] = useState<Performance>({
    pricePaid: 0,
    pricePaidForPerf: 0,
    currentValue: 0,
    currentValueForPerf: 0,
    valueChange: 0,
    percentChange: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchHoldings(user);
  }, [user]);

  /** Fetches holdings from the API and sets their performance. */
  async function fetchHoldings(user: User) {
    const holdings = await API.listHoldings(user.username);
    if (!holdings.length) {
      setIsDataLoaded(true);
      return;
    }
    for (const holding of holdings) {
      setHoldingPerformance(holding);
    }
    setHoldings(holdings);
    setTotalPerformance(getTotalPerformance(holdings));
    setIsDataLoaded(true);
  }

  const [open, setOpen] = React.useState(holdings.map(() => false));
  const handleClick = (i: number) => {
    open[i] = !open[i];
    setOpen([...open]);
  };

  const addHolding = (holding: Holding) => {
    holdings.push(holding);
    holdings.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    setHoldings([...holdings]);
  };

  const deleteHolding = async (id: number, holdingIndex: number) => {
    try {
      await API.deleteHolding(id);
      holdings.splice(holdingIndex, 1);
      setTotalPerformance(getTotalPerformance(holdings));
      setHoldings([...holdings]);
    } catch (err) {
      console.error(err);
    }
  };

  /** Adds a trade that has just been created on the API to the display. */
  async function addTrade(trade: Trade, holdingIndex: number) {
    const holding = holdings[holdingIndex];
    holding.trades.push(trade);
    setHoldingPerformance(holding);
    setTotalPerformance(getTotalPerformance(holdings));
    setHoldings([...holdings]);
  }

  async function deleteTrade(
    id: number,
    holdingIndex: number,
    tradeIndex: number
  ) {
    try {
      await API.deleteTrade(id);
      const holding = holdings[holdingIndex];
      holding.trades.splice(tradeIndex, 1);
      setHoldingPerformance(holding);
      setTotalPerformance(getTotalPerformance(holdings));
      setHoldings([...holdings]);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshPrices() {
    setIsRefreshing(true);
    await API.refreshPrices();
    await fetchHoldings(user);
    setIsRefreshing(false);
  }

  if (!isDataLoaded) {
    return <div className='loading'>Loading...</div>;
  }
  return (
    <div className='HoldingsList'>
      <h2>Holdings</h2>
      {totalPerformance && (
        <div className='totalPerformance'>
          <div>
            Price paid:{' '}
            <strong>
              {formatValue(totalPerformance.pricePaid, user.currency)}
            </strong>
          </div>
          <div>
            Current value:{' '}
            <strong>
              {formatValue(totalPerformance.currentValue, user.currency)}
            </strong>
          </div>
          <div>
            <div>Total Performance (incl. sales):</div>
            <PerformanceDisplay performance={totalPerformance} user={user} />
          </div>
          <Button
            variant='contained'
            color='primary'
            disabled={isRefreshing}
            onClick={() => refreshPrices()}
            aria-label='Refresh prices'>
            Refresh Prices
          </Button>
        </div>
      )}
      {Boolean(holdings.length) && (
        <TableContainer>
          <Table size='small' aria-label='Holdings table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Current Bid Price</TableCell>
                <TableCell>Exchange</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.map((h, i) => {
                return (
                  <React.Fragment key={i}>
                    <TableRow
                      className='Holding-row'
                      onClick={() => {
                        handleClick(i);
                      }}>
                      {/* Name and Symbol */}
                      <TableCell>{holdingTitle(h)}</TableCell>
                      {/* Value */}
                      <TableCell>
                        {formatValue(
                          h.performance?.currentValue ?? 0,
                          user.currency
                        )}
                      </TableCell>
                      {/* Performance */}
                      <TableCell>
                        {h.performance ? (
                          <PerformanceDisplay
                            performance={h.performance}
                            user={user}
                          />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      {/* Current Bid Price */}
                      <TableCell>
                        {formatValue(h.bidPrice, h.currency)}
                      </TableCell>
                      {/* Exchange */}
                      <TableCell>{h.exchange}</TableCell>
                      {/* Chart button */}
                      <TableCell>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          href={chartUrl(h)}
                          target='_blank'>
                          <ShowChartIcon fontSize='small' />
                        </IconButton>
                      </TableCell>
                      {/* Delete button */}
                      <TableCell>
                        <IconButton
                          onClick={() => deleteHolding(h.id, i)}
                          aria-label='delete'>
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          borderBottom: 0,
                          paddingBottom: 0,
                          paddingTop: 0,
                        }}
                        colSpan={5}>
                        <Collapse in={open[i]} timeout='auto' unmountOnExit>
                          <TradesList
                            holding={h}
                            user={user}
                            onDeleteTradeClicked={(
                              id: number,
                              tradeIndex: number
                            ) => {
                              deleteTrade(id, i, tradeIndex);
                            }}></TradesList>
                          <div className='AddTradeDialog-button-container'>
                            <AddTradeDialog
                              holding={h}
                              onTradeCreated={(trade: Trade) =>
                                addTrade(trade, i)
                              }></AddTradeDialog>
                          </div>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div style={{margin: '20px 0'}}>
        <AddHoldingForm
          username={user.username}
          onHoldingCreated={(h: Holding) => addHolding(h)}></AddHoldingForm>
      </div>
    </div>
  );
}

/** Gets a display title for the holding. */
function holdingTitle(h: Holding) {
  let title = h.name;
  if (h.symbol) title += ` (${h.symbol})`;
  return title;
}

/**
 * Returns a URL for a chart of the given holding.
 * Currently uses Google finance.
 */
function chartUrl(h: Holding) {
  let exchange = h.exchange;
  if (exchange === 'LSE') exchange = 'LON';
  return `https://www.google.com/search?q=${exchange}:+${h.symbol}&tbm=fin`;
}
