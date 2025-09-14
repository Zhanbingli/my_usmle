import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Input, 
  Form, 
  Alert, 
  Spin, 
  Space, 
  Tag, 
  Divider,
  Row,
  Col,
  Steps,
  message
} from 'antd';
import { 
  BookOutlined, 
  ArrowLeftOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useCase, useSubmitDiagnosis } from '../hooks/useCasesQuery';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

const CaseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [submittedDiagnosis, setSubmittedDiagnosis] = useState<string>('');

  const { data: caseData, isLoading, error } = useCase(id!, false);
  const submitDiagnosisMutation = useSubmitDiagnosis();

  const handleSubmitDiagnosis = async (values: { diagnosis: string }) => {
    if (!id) return;

    try {
      const result = await submitDiagnosisMutation.mutateAsync({
        caseId: id,
        diagnosis: values.diagnosis
      });

      setSubmittedDiagnosis(values.diagnosis);
      setShowAnswer(true);
      setCurrentStep(4);

      if (result.isCorrect) {
        message.success('诊断正确！');
      } else {
        message.warning('诊断不完全正确，请查看反馈');
      }
    } catch (error) {
      message.error('提交失败，请稍后重试');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return difficulty;
    }
  };

  const getCategoryText = (category: string) => {
    const categoryMap: Record<string, string> = {
      'cardiology': '心内科',
      'gastroenterology': '消化科',
      'neurology': '神经科',
      'respiratory': '呼吸科',
      'endocrinology': '内分泌科',
      'oncology': '肿瘤科',
      'emergency': '急诊科',
      'surgery': '外科',
      'pediatrics': '儿科',
      'gynecology': '妇科'
    };
    return categoryMap[category] || category;
  };

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'finish';
    if (step === currentStep) return 'process';
    return 'wait';
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text type="secondary">加载病例中...</Text>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Alert
            message="加载失败"
            description="无法加载病例详情，请稍后重试"
            type="error"
            showIcon
          />
          <div style={{ marginTop: '16px' }}>
            <Button onClick={() => navigate('/cases')}>
              返回病例列表
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: 'calc(100vh - 160px)' }}>
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/cases')}
          >
            返回
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            <BookOutlined /> {caseData.title}
          </Title>
        </Space>
        
        <div style={{ marginTop: '8px' }}>
          <Space>
            <Tag color="blue">
              {getCategoryText(caseData.category)}
            </Tag>
            <Tag color={getDifficultyColor(caseData.difficulty)}>
              {getDifficultyText(caseData.difficulty)}
            </Tag>
          </Space>
        </div>
      </div>

      {/* 进度步骤 */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps current={currentStep} size="small">
          <Step title="病史" status={getStepStatus(0)} />
          <Step title="体格检查" status={getStepStatus(1)} />
          <Step title="实验室检查" status={getStepStatus(2)} />
          <Step title="诊断" status={getStepStatus(3)} />
          <Step title="结果" status={getStepStatus(4)} />
        </Steps>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 左侧：病例信息 */}
        <Col xs={24} lg={16}>
          <Card title="病例信息">
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {caseData.description}
            </Paragraph>

            {/* 临床资料 */}
            {caseData.clinicalNotes && caseData.clinicalNotes.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <Title level={4}>临床资料</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {caseData.clinicalNotes.map((note, index) => (
                    <Card 
                      key={index} 
                      size="small" 
                      title={
                        <Space>
                          <InfoCircleOutlined />
                          {note.type === 'history' && '病史'}
                          {note.type === 'physical' && '体格检查'}
                          {note.type === 'lab' && '实验室检查'}
                          {note.type === 'imaging' && '影像学检查'}
                        </Space>
                      }
                      style={{ 
                        cursor: 'pointer',
                        opacity: currentStep >= index ? 1 : 0.5
                      }}
                      onClick={() => setCurrentStep(Math.max(currentStep, index + 1))}
                    >
                      <Text>{note.content}</Text>
                    </Card>
                  ))}
                </Space>
              </div>
            )}
          </Card>
        </Col>

        {/* 右侧：诊断区域 */}
        <Col xs={24} lg={8}>
          <Card title="诊断区域">
            {!showAnswer ? (
              <Form
                form={form}
                onFinish={handleSubmitDiagnosis}
                layout="vertical"
              >
                <Form.Item
                  name="diagnosis"
                  label="请输入您的诊断"
                  rules={[
                    { required: true, message: '请输入诊断结果' },
                    { min: 2, message: '诊断至少2个字符' }
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="请根据病例信息给出您的诊断..."
                    disabled={submitDiagnosisMutation.isPending}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    loading={submitDiagnosisMutation.isPending}
                    block
                    disabled={currentStep < 3}
                  >
                    提交诊断
                  </Button>
                </Form.Item>

                {currentStep < 3 && (
                  <Alert
                    message="请先查看完所有临床资料"
                    type="info"
                    showIcon
                    style={{ marginTop: '16px' }}
                  />
                )}
              </Form>
            ) : (
              <div>
                {/* 诊断结果 */}
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>您的诊断：</Text>
                  <div style={{ 
                    padding: '8px 12px', 
                    background: '#f5f5f5', 
                    borderRadius: '6px',
                    marginTop: '8px'
                  }}>
                    {submittedDiagnosis}
                  </div>
                </div>

                <Divider />

                {/* 正确答案和反馈 */}
                {submitDiagnosisMutation.data && (
                  <div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Alert
                        message={
                          submitDiagnosisMutation.data.isCorrect 
                            ? "诊断正确！" 
                            : "诊断需要改进"
                        }
                        type={submitDiagnosisMutation.data.isCorrect ? "success" : "warning"}
                        icon={
                          submitDiagnosisMutation.data.isCorrect 
                            ? <CheckCircleOutlined />
                            : <CloseCircleOutlined />
                        }
                        showIcon
                      />

                      <div>
                        <Text strong>正确诊断：</Text>
                        <div style={{ 
                          padding: '8px 12px', 
                          background: '#f6ffed', 
                          border: '1px solid #b7eb8f',
                          borderRadius: '6px',
                          marginTop: '8px'
                        }}>
                          {submitDiagnosisMutation.data.correctDiagnosis}
                        </div>
                      </div>

                      <div>
                        <Text strong>专家点评：</Text>
                        <Paragraph style={{ 
                          marginTop: '8px',
                          padding: '12px',
                          background: '#fafafa',
                          borderRadius: '6px'
                        }}>
                          {submitDiagnosisMutation.data.feedback}
                        </Paragraph>
                      </div>
                    </Space>

                    <div style={{ marginTop: '24px' }}>
                      <Space>
                        <Button onClick={() => navigate('/cases')}>
                          返回列表
                        </Button>
                        <Button 
                          type="primary" 
                          onClick={() => window.location.reload()}
                        >
                          重新练习
                        </Button>
                      </Space>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CaseDetailPage; 