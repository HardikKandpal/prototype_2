FROM python:3.9-slim

WORKDIR /code

# Copy requirements first for better caching
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the application
COPY . /code/

# Make sure data directories exist
RUN mkdir -p /code/data /code/models /code/trained_models

# Make port 7860 available (Hugging Face Spaces uses port 7860)
EXPOSE 7860

# Run the application on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]