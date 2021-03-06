import { ListItem } from "@components/Common/ListItem";
import { Transaction } from "@io/http";
import * as React from "react";

interface FundListItemProps {
  fund: Transaction.TransactionFrontmatter;
}

export const FundListItem: React.FC<FundListItemProps> = ({ fund }) => {
  return <ListItem>{fund.amount}</ListItem>;
};
