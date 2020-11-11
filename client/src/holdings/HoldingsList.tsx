import './HoldingsList.css';
import API, {Holding, Trade, Performance, User} from '../api';
import React, {useEffect, useState} from 'react';
import {
  formatValue,
  getTotalPerformance,
  setHoldingPerformance,
} from './performance_utils';
import AddHoldingForm from './AddHoldingForm';
import AddTrade from './AddTradeDialog';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PerformanceDisplay from './PerformanceDisplay';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TradesList from './TradesList';

export type HoldingsListProps = {
  user: User;
};

/** Displays of all the user's holdings with the option to add more. */
export default function HoldingsList({user}: HoldingsListProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [totalPerformance, setTotalPerformance] = useState<Performance>({
    pricePaid: 0,
    currentValue: 0,
    valueChange: 0,
    percentChange: 0,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchHoldings(user);
  }, [user]);

  /** Fetches holdings from the API and sets their performance. */
  const fetchHoldings = async (user: User) => {
    const holdings = await API.listHoldings(user.username);
    if (!holdings.length) return;
    for (const holding of holdings) {
      setHoldingPerformance(holding);
    }
    setHoldings(holdings);
    setTotalPerformance(getTotalPerformance(holdings));
    setIsDataLoaded(true);
  };

  const [open, setOpen] = React.useState(holdings.map(() => false));
  const handleClick = (i: number) => {
    open[i] = !open[i];
    setOpen([...open]);
  };

  const addHolding = (holding: Holding) => {
    holdings.push(holding);
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
  const addTrade = (trade: Trade, holdingIndex: number) => {
    const holding = holdings[holdingIndex];
    holding.trades.push(trade);
    setHoldingPerformance(holding);
    setTotalPerformance(getTotalPerformance(holdings));
    setHoldings([...holdings]);
  };

  const deleteTrade = async (
    id: number,
    holdingIndex: number,
    tradeIndex: number,
  ) => {
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
  };

  const refreshPrices = async () => {
    setIsRefreshing(true);
    await API.refreshPrices();
    await fetchHoldings(user);
    setIsRefreshing(false);
  };

  if (!isDataLoaded) {
    return <div className="loading">Loading...</div>;
  }
  return (
    <div className="HoldingsList">
      <h2>Holdings</h2>
      {totalPerformance && (
        <div className="totalPerformance">
          <div>
            Current value:{' '}
            <strong>
              {formatValue(totalPerformance.currentValue, user.currency)}
            </strong>
          </div>
          <div>
            <div>Total Performance:</div>
            <PerformanceDisplay performance={totalPerformance} user={user} />
          </div>
          <Button
            variant="contained"
            color="primary"
            disabled={isRefreshing}
            onClick={() => refreshPrices()}
            aria-label="Refresh prices"
          >
            Refresh Prices
          </Button>
        </div>
      )}
      {Boolean(holdings.length) && (
        <TableContainer>
          <Table size="small" aria-label="Holdings table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Performance</TableCell>
                <TableCell>Current Bid Price</TableCell>
                <TableCell>Exchange</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {holdings.map((h, i) => {
                return (
                  <React.Fragment key={i}>
                    <TableRow
                      className="Holding-row"
                      onClick={() => {
                        handleClick(i);
                      }}
                    >
                      <TableCell>
                        {h.name} ({h.symbol})
                      </TableCell>
                      <TableCell>
                        {formatValue(
                          h.performance?.currentValue ?? 0,
                          user.currency,
                        )}
                      </TableCell>
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
                      <TableCell>
                        {formatValue(h.bidPrice, h.currency)}
                      </TableCell>
                      <TableCell>{h.exchange}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => deleteHolding(h.id, i)}
                          aria-label="delete"
                        >
                          <DeleteIcon fontSize="small" />
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
                        colSpan={5}
                      >
                        <Collapse in={open[i]} timeout="auto" unmountOnExit>
                          <TradesList
                            holding={h}
                            user={user}
                            onDeleteTradeClicked={(
                              id: number,
                              tradeIndex: number,
                            ) => {
                              deleteTrade(id, i, tradeIndex);
                            }}
                          ></TradesList>
                          <div className="AddTrade-button-container">
                            <AddTrade
                              holding={h}
                              onTradeCreated={(trade: Trade) =>
                                addTrade(trade, i)
                              }
                            ></AddTrade>
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
          onHoldingCreated={(h: Holding) => addHolding(h)}
        ></AddHoldingForm>
      </div>
    </div>
  );
}
