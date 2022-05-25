import { useState, useCallback, useEffect } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { identifierApi  } from '../../../__fake-api__/did-api';
import { useMounted } from '../../../hooks/use-mounted';
import { ArrowRight as ArrowRightIcon } from '../../../icons/arrow-right';
import type { IKey } from '@veramo/core';
import { SeverityPill } from '../../severity-pill';
import { truncate } from '../../../utils/truncate';

interface DidKeysSummaryProps {
  controllerKeyId: string;
}

export const DidKeysSummary: FC<DidKeysSummaryProps> = (props) => {
  const isMounted = useMounted();
  const [keys, setKeys] = useState<IKey[]>([]);

  const getKeys = useCallback(async () => {
    try {
      const data = await identifierApi.getKeys();

      if (isMounted()) {
        setKeys(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getKeys();
  }, [getKeys]);

  return (
    <Card {...props}>
      <CardHeader title="Keys" />
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Kid
            </TableCell>
            <TableCell>
              Management System
            </TableCell>
            <TableCell>
              Permission
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key.kid}>
              <TableCell>
                {truncate(key.kid)}
              </TableCell>
              <TableCell>
                {key.kms}
              </TableCell>
              <TableCell>
                <SeverityPill color={key.kid === props.controllerKeyId ? 'warning' : 'info'}>
                    {key.kid === props.controllerKeyId ? 'Controller' : 'Delegate'}
                </SeverityPill>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

DidKeysSummary.propTypes = {
  controllerKeyId: PropTypes.string
}
