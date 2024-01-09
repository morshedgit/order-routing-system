type ViewOrderProps = { params: { orderId: string } };
const ViewOrder = (props: ViewOrderProps) => {
  return <div>{props.params.orderId}</div>;
};

export default ViewOrder;
