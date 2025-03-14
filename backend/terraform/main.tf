provider "aws" {
  region = "us-east-2"
}

# IAM Role para o Lambda (existente)
resource "aws_iam_role" "lambda_execution_role" {
  name                  = "dagbok-django-dev-ZappaLambdaExecutionRole"
  force_detach_policies = true # Permite atualizar políticas sem erros

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  # Ignora a criação se a role já existir
  lifecycle {
    create_before_destroy = true
  }
}

# Política personalizada baseada na zappa-permissions
resource "aws_iam_role_policy" "lambda_policy" {
  name = "zappa-permissions"
  role = aws_iam_role.lambda_execution_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:*"]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["lambda:InvokeFunction"]
        Resource = ["*"]
      },
      {
        Effect   = "Allow"
        Action   = ["xray:PutTraceSegments", "xray:PutTelemetryRecords"]
        Resource = ["*"]
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:AttachNetworkInterface",
          "ec2:CreateNetworkInterface",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeInstances",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DetachNetworkInterface",
          "ec2:ModifyNetworkInterfaceAttribute",
          "ec2:ResetNetworkInterfaceAttribute"
        ]
        Resource = ["*"]
      },
      {
        Effect   = "Allow"
        Action   = ["s3:*"]
        Resource = "arn:aws:s3:::*"
      },
      {
        Effect   = "Allow"
        Action   = ["kinesis:*"]
        Resource = "arn:aws:kinesis:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["sns:*"]
        Resource = "arn:aws:sns:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["sqs:*"]
        Resource = "arn:aws:sqs:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["dynamodb:*"]
        Resource = "arn:aws:dynamodb:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["route53:*"]
        Resource = ["*"]
      }
    ]
  })
}
