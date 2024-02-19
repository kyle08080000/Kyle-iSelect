import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import logo4 from "../images/logo4.png";
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from '../slice/messageSlice';
import { useState } from 'react';

const CouponCard = ({ coupon }) => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false); // 追踪按钮的禁用状态

  const handleCopy = async (code) => {
    setIsDisabled(true);
    try {
      await navigator.clipboard.writeText(code);
      // 這裡使用創建的異步消息 action
      dispatch(createAsyncMessage({ success: true, message: `已複製: ${code}` }));
    } catch (error) {
      dispatch(createAsyncMessage({ success: false, message: "無法複製" }));
    }

    setTimeout(() => setIsDisabled(false), 3000);  // 3秒后重新启用按钮
  };

  return (
    <Card className={`card-coupon cardCoupon`}>
      {/* 左侧圆形 */}
      <div className={`circle left`}></div>
      <Card.Body className="d-flex align-items-center">
        <Card.Img 
          variant="top" 
          src={coupon.logo} 
          style={{ width: '25%'}} 
          className="ms-3"
          />
        {/* 添加黑线 */}
        <div className="divider"></div>
        <div className="ms-5">
          <Card.Title className="fs-6">{coupon.title}</Card.Title>
          <Card.Text className="mb-1"><span className="h4">{coupon.description}</span> 優惠券</Card.Text>
          <Card.Text>
            {coupon.code}
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => handleCopy(coupon.code)}
              className="ms-1"
              disabled={isDisabled}
            >
              <i className="bi bi-files"></i>
            </Button>
          </Card.Text>
        </div>
      </Card.Body>
      {/* 右侧圆形 */}
      <div className={`circle right`}></div>
    </Card>
  );
};

export const MyCoupons = () => {
  // 範例優惠券資料
  const coupons = [
    {
      id: 1,
      title: '紅包拿不完',
      description: '8折',
      code: 'REDPACKET80',
      logo: logo4,
    },
    {
      id: 2,
      title: '春節過好年',
      description: '3折',
      code: 'NEWYEAR30',
      logo: logo4,
    },
    // ... 其他優惠券資料
  ];

  return (
    <Container>
      <Row>
        <Col className="d-flex align-items-center flex-column">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default MyCoupons;
