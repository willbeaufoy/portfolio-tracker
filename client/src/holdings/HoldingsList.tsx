import './HoldingsList.css';

import {useConfirm} from 'material-ui-confirm';
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
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import {API} from '../api';
import {USER_CURRENCY} from '../settings';
import {
  Dividend,
  FxRates,
  Holding,
  isTrade,
  Performance,
  Trade,
  Transaction,
  User,
} from '../types';
import {AddDividendDialog} from './AddDividendDialog';
import {AddHoldingForm} from './AddHoldingForm';
import {AddTradeDialog} from './AddTradeDialog';
import {PerformanceDisplay} from './PerformanceDisplay';
import {TransactionsList} from './TransactionsList';
import {formatValue} from './utils/display';
import {getTotalPerformance, PerfCalculator} from './utils/performance';

export type IProps = {
  user: User;
  fxRates: FxRates;
};

/** Displays of all the user's holdings with the option to add more. */
export function HoldingsList({user, fxRates}: IProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isHoldingOpen, setIsHoldingOpen] = React.useState(
    holdings.map(() => false)
  );
  const [totalPerformance, setTotalPerformance] = useState<Performance>({
    pricePaid: 0,
    pricePaidForPerf: 0,
    currentValue: 0,
    currentValueForPerf: 0,
    valueChange: 0,
    percentChange: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const confirm = useConfirm();
  const perfCalculator = new PerfCalculator({userCurrency: USER_CURRENCY});
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackClose = (event: any, reason: any) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  function Alert(props: any) {
    return (
      <MuiAlert elevation={6} variant='filled' severity='error' {...props} />
    );
  }

  useEffect(() => {
    perfCalculator.setFx(fxRates);
    fetchHoldings(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, fxRates]);

  /** Fetches holdings from the API and sets their performance. */
  async function fetchHoldings(user: User) {
    const holdings = await API.listHoldings(user.username);
    if (!holdings.length) {
      setIsDataLoaded(true);
      return;
    }
    for (const holding of holdings) {
      perfCalculator.setHoldingPerformance(holding);
    }
    setHoldings(holdings);
    setTotalPerformance(getTotalPerformance(holdings));
    setIsDataLoaded(true);
  }

  function toggleIsHoldingOpen(i: number) {
    isHoldingOpen[i] = !isHoldingOpen[i];
    setIsHoldingOpen([...isHoldingOpen]);
  }

  function addHolding(holding: Holding) {
    holdings.push(holding);
    holdings.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    setHoldings([...holdings]);
  }

  async function confirmDeleteHolding(id: number, holdingIndex: number) {
    try {
      await confirm({
        title: `Really delete holding ${holdings[holdingIndex].symbol}?`,
        description: 'This action is permanent!',
      });
    } catch (err) {
      // User did not confirm deletion so do nothing.
      return;
    }
    try {
      await API.deleteHolding(id);
      holdings.splice(holdingIndex, 1);
      setTotalPerformance(getTotalPerformance(holdings));
      setHoldings([...holdings]);
    } catch (err) {
      Alert(setSnackbarOpen(true));
    }
  }

  /** Adds a trade that has just been created on the API to its holding. */
  async function addTrade(trade: Trade, holdingIndex: number) {
    const holding = holdings[holdingIndex];
    holding.trades.push(trade);
    perfCalculator.setHoldingPerformance(holding);
    setTotalPerformance(getTotalPerformance(holdings));
    setHoldings([...holdings]);
  }

  /** Adds a dividend that has just been created on the API to its holding. */
  async function addDividend(dividend: Dividend, holdingIndex: number) {
    const holding = holdings[holdingIndex];
    holding.dividends.push(dividend);
    perfCalculator.setHoldingPerformance(holding);
    setTotalPerformance(getTotalPerformance(holdings));
    setHoldings([...holdings]);
  }

  /**
   * Opens a confirm dialog to delete the transaction (trade or dividend) with the given ID
   * and deletes it if the user confirms.
   */
  async function confirmDeleteTransaction(
    t: Transaction,
    holdingIndex: number
  ) {
    try {
      await confirm({
        title: `Really delete this ${holdings[holdingIndex].symbol} ${
          isTrade(t) ? 'trade' : 'dividend'
        }?`,
        description: 'This action is permanent!',
      });
    } catch (err) {
      // User did not confirm deletion so do nothing.
      return;
    }
    try {
      const holding = holdings[holdingIndex];
      if (isTrade(t)) {
        await API.deleteTrade(t.id);
        const i = holding.trades.indexOf(t);
        holding.trades.splice(i, 1);
      } else {
        await API.deleteDividend(t.id);
        const i = holding.dividends.indexOf(t);
        holding.dividends.splice(i, 1);
      }
      perfCalculator.setHoldingPerformance(holding);
      setTotalPerformance(getTotalPerformance(holdings));
      setHoldings([...holdings]);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshPrices() {
    try {
      setIsRefreshing(true);
      await API.refreshPrices();
      await fetchHoldings(user);
    } catch (err) {
      console.error(err);
    }
    setIsRefreshing(false);
  }

  if (!isDataLoaded) {
    return (
      <div className='loading'>
        <CircularProgress />
      </div>
    );
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
          {Boolean(holdings.length) && (
            <Tooltip
              title={
                'Last updated at:' +
                new Date(holdings[0]?.bidPriceUpdateTime).toLocaleString()
              }
              arrow>
              <Button
                variant='contained'
                color='primary'
                disabled={isRefreshing}
                onClick={() => refreshPrices()}
                aria-label='Refresh prices'>
                Refresh Prices
              </Button>
            </Tooltip>
          )}
          <div>
            {!!isRefreshing && (
              <CircularProgress size={25} style={{marginRight: '10px'}} />
            )}
          </div>
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
                        toggleIsHoldingOpen(i);
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
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteHolding(h.id, i);
                          }}
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
                        <Collapse
                          in={isHoldingOpen[i]}
                          timeout='auto'
                          unmountOnExit>
                          <TransactionsList
                            holding={h}
                            user={user}
                            onDeleteTransactionClicked={(t: Transaction) => {
                              confirmDeleteTransaction(t, i);
                            }}></TransactionsList>
                          <div style={{display: 'flex'}}>
                            <div style={{margin: '15px 0 15px 15px'}}>
                              <AddTradeDialog
                                holding={h}
                                onTradeCreated={(trade: Trade) =>
                                  addTrade(trade, i)
                                }></AddTradeDialog>
                            </div>
                            <div style={{margin: '15px 0 15px 15px'}}>
                              <AddDividendDialog
                                holding={h}
                                onDividendCreated={(dividend: Dividend) =>
                                  addDividend(dividend, i)
                                }></AddDividendDialog>
                            </div>
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
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose}>Operation Failed</Alert>
      </Snackbar>
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
