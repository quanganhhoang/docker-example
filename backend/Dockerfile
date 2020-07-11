FROM tiangolo/uwsgi-nginx-flask:python3.8
WORKDIR /project
COPY . /project
RUN pip install -r requirements.txt
RUN python3 nltk_script.py
EXPOSE 8000
CMD ["python", "app.py"]