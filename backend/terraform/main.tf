provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "dagbok_lamba" {
  bucket = "dagbok-lamba-api" # Nome do bucket
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

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
}

resource "aws_lambda_function" "django_lambda" {
  function_name = "dagbok-lamba" # Nome da função Lambda
  handler       = "handler.lambda_handler"
  runtime       = "python3.9"
  role          = aws_iam_role.lambda_exec_role.arn
  s3_bucket     = aws_s3_bucket.dagbok_lamba.bucket
  s3_key        = "zappa-bucket/zappa_deploy.zip" # Prefixo e nome do arquivo ZIP
  timeout       = 300
  memory_size   = 512

  environment {
    variables = {
      DJANGO_SETTINGS_MODULE = "dagbok.settings" # Módulo de configurações do Django
    }
  }
}

resource "aws_api_gateway_rest_api" "django_api" {
  name        = "dagbok-api" # Nome do API Gateway
  description = "API Gateway para o projeto Django"
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.django_api.id
}

resource "aws_api_gateway_stage" "dev" {
  stage_name    = "dev" # Nome do estágio (ex: dev, prod)
  rest_api_id   = aws_api_gateway_rest_api.django_api.id
  deployment_id = aws_api_gateway_deployment.deployment.id
}
